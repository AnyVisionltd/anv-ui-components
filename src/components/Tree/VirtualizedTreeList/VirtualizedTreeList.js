import React, { useRef, useMemo } from 'react'
import propTypes from 'prop-types'
import { VariableSizeTree as TreeList } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'
import { throttle } from '../../../utils'
import { TREE_NODE_PADDING } from '../utils'
import styles from './VirtualizedTreeList.module.scss'

const Node = ({
  data,
  isOpen,
  style,
  toggle,
  treeData: {
    renderNode,
    maxContainerWidth,
    nodesMap,
    childrenKey,
    idKey,
    onExpand,
  },
}) => {
  const { nestingLevel, parentKey, isLeaf, index, [idKey]: key } = data
  const paddingLeft = 2 * TREE_NODE_PADDING * nestingLevel
  const additionalStyle = {
    paddingLeft,
    maxWidth: maxContainerWidth - paddingLeft,
  }
  const isLastLeafOfParent =
    isLeaf && nodesMap[parentKey]?.[childrenKey].length - 1 === index

  const handleExpand = () => {
    !isOpen && onExpand(key)
    toggle()
  }

  const content = renderNode(data, nestingLevel, {
    isOpen,
    handleExpand,
    isLastLeaf: isLastLeafOfParent,
    style: additionalStyle,
  })

  return <div style={style}>{content}</div>
}

const determineDefaultHeight = (isParentNode, layer, nodeHeightsValues) => {
  const { leafNodeHeight, parentNodeHeight, rootNodeHeight } = nodeHeightsValues
  if (!isParentNode) return leafNodeHeight
  return layer === 0 ? rootNodeHeight : parentNodeHeight
}

const buildTreeWalker = ({
  rootNode,
  nodeHeightsValues,
  childrenKey,
  labelKey,
}) =>
  function* treeWalker(refresh) {
    const stack = Object.values(rootNode).map(node => ({
      nestingLevel: 0,
      node,
    }))

    while (stack.length) {
      const { node, nestingLevel } = stack.shift()
      const {
        isParentNode,
        [labelKey]: label,
        [childrenKey]: children,
        visible,
        uniqueKey,
      } = node

      if (!visible) continue

      const isOpened = yield refresh
        ? {
            defaultHeight: determineDefaultHeight(
              isParentNode,
              nestingLevel,
              nodeHeightsValues,
            ),
            isOpenByDefault: false,
            id: uniqueKey,
            name: label,
            isLeaf: !isParentNode,
            nestingLevel,
            ...node,
          }
        : uniqueKey

      if (isParentNode && isOpened) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.unshift({
            nestingLevel: nestingLevel + 1,
            node: children[i],
          })
        }
      }
    }
  }

const VirtualizedTreeList = ({
  setTreeInstance,
  rootNode,
  renderNode,
  loadMoreData,
  isSearching,
  nodesMap,
  onExpand,
  nodeHeightsValues,
  ...keyValues
}) => {
  const innerRef = useRef()
  const throttledLoadMoreData = useMemo(() => throttle(loadMoreData), [
    loadMoreData,
  ])

  const handleInfiniteScroll = (
    { scrollOffset, scrollDirection },
    listHeight,
  ) => {
    const virtualizedListHeight = innerRef.current.offsetHeight
    if (
      scrollDirection === 'backward' ||
      listHeight > virtualizedListHeight ||
      isSearching
    )
      return
    if (virtualizedListHeight - listHeight <= scrollOffset) {
      throttledLoadMoreData()
    }
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <TreeList
          className={styles.virtualizedTree}
          ref={setTreeInstance}
          itemData={{
            renderNode,
            maxContainerWidth: width,
            nodesMap,
            onExpand,
            ...keyValues,
          }}
          treeWalker={buildTreeWalker({
            rootNode,
            nodeHeightsValues,
            ...keyValues,
          })}
          height={height}
          width={width}
          innerRef={innerRef}
          onScroll={scrollPosition =>
            handleInfiniteScroll(scrollPosition, height)
          }
        >
          {Node}
        </TreeList>
      )}
    </AutoSizer>
  )
}

VirtualizedTreeList.defaultProps = {
  renderNode: () => {},
  setTreeInstance: () => {},
  loadMoreData: () => {},
  onExpand: () => {},
}

VirtualizedTreeList.propTypes = {
  /** Tree structure needed for rendering the tree list. */
  rootNode: propTypes.object.isRequired,
  /** A map object that is used to store data about the tree nodes. */
  nodesMap: propTypes.object.isRequired,
  /** Render function for the nodes of the tree. */
  renderNode: propTypes.func,
  /** Set ref to the list component, so it can be accessible in Tree component. */
  setTreeInstance: propTypes.func,
  /** A callback that is called when more data needs to be fetched. */
  loadMoreData: propTypes.func,
  /** Wether user is searching or not. */
  isSearching: propTypes.bool,
  /** Called when a tree parent node is displayed. */
  onExpand: propTypes.func,
  /** The key value of the node's children property. Default is 'children'. */
  childrenKey: propTypes.string,
  /** The key value of the node's unique id property. Default is 'key'. */
  idKey: propTypes.string,
  /** The key value of the node's name property. Default is 'label'. */
  labelKey: propTypes.string,
  /** An object that contains the height of leaf nodes, parent nodes and root nodes. */
  nodeHeightsValues: propTypes.shape({
    leafNodeHeight: propTypes.number.isRequired,
    parentNodeHeight: propTypes.number.isRequired,
    rootNodeHeight: propTypes.number.isRequired,
  })
}

export default VirtualizedTreeList
