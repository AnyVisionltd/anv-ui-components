import React, { useRef, useMemo, useState } from 'react'
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
  setOpen,
  treeData: {
    renderNode,
    maxContainerWidth,
    nodesMap,
    childrenKey,
    idKey,
    onExpand,
    selfControlled,
    handleLoadChildrenToParentNode,
  },
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    nestingLevel,
    parentKey,
    isLeaf,
    index,
    [idKey]: key,
    uniqueKey,
  } = data
  const paddingLeft = 2 * TREE_NODE_PADDING * nestingLevel
  const additionalStyle = {
    paddingLeft,
    maxWidth: maxContainerWidth - paddingLeft,
  }
  const isLastLeafOfParent =
    isLeaf && nodesMap[parentKey]?.[childrenKey].length - 1 === index

  const handleExpand = async () => {
    if (isOpen || selfControlled || !onExpand) {
      await setOpen(!isOpen)
      return
    }

    setIsLoading(true)
    const newChildren = await onExpand(key)
    if (newChildren) {
      handleLoadChildrenToParentNode(key, newChildren)
    }
    await setOpen(!isOpen)
    setIsLoading(false)
  }

  const content = renderNode(data, nestingLevel, {
    isOpen,
    handleExpand,
    isLastLeaf: isLastLeafOfParent,
    style: additionalStyle,
    isLoading,
  })

  return (
    <div key={uniqueKey} style={style}>
      {content}
    </div>
  )
}

const determineDefaultHeight = (isParentNode, layer, nodeHeightsValues) => {
  const { leafNodeHeight, parentNodeHeight, rootNodeHeight } = nodeHeightsValues
  if (!isParentNode) return leafNodeHeight
  return layer === 0 ? rootNodeHeight : parentNodeHeight
}

const getNodeData = ({ node, nestingLevel, nodeHeightsValues, labelKey }) => {
  const { isParentNode, [labelKey]: label, uniqueKey } = node
  return {
    data: {
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
    },
    nestingLevel,
    node,
  }
}

const buildTreeWalker = ({
  rootNode,
  nodeHeightsValues,
  childrenKey,
  labelKey,
}) =>
  function* treeWalker() {
    const rootNodes = Object.values(rootNode)

    for (let i = 0; i < rootNodes.length; i++) {
      yield getNodeData({
        node: rootNodes[i],
        nestingLevel: 0,
        nodeHeightsValues,
        labelKey,
      })
    }

    while (true) {
      const parentMeta = yield
      if (parentMeta.node.isParentNode) {
        for (let i = 0; i < parentMeta.node?.[childrenKey].length; i++) {
          yield getNodeData({
            node: parentMeta.node.children[i],
            nestingLevel: parentMeta.nestingLevel + 1,
            nodeHeightsValues,
            labelKey,
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
  selfControlled,
  handleLoadChildrenToParentNode,
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
            selfControlled,
            handleLoadChildrenToParentNode,
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
          async
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
  }),
}

export default VirtualizedTreeList
