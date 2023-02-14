import React, { useRef, useMemo, useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { VariableSizeTree as TreeList } from 'react-vtree'
import { useInView } from 'react-intersection-observer'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Loader } from '@anyvision/anv-icons'
import { throttle } from '../../../utils'
import {
  isPaginationNode,
  isPlaceholderNode,
  nodesListTypes,
  PAGINATION_NODE_HEIGHT,
  PAGINATION_NODE_ID,
  PLACEHOLDER_NODE_ID,
  TREE_NODE_PADDING,
} from '../utils'
import { useTreeDragDrop } from '../useTreeDragAndDrop'
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
    onDragItem,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    isDraggable,
  },
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView()

  const {
    nestingLevel,
    parentKey,
    isLeaf,
    index,
    [idKey]: key,
    uniqueKey,
    type,
  } = data

  useEffect(() => {
    if (isPaginationNode({ type }) && inView) {
      ;(async () => {
        setIsLoading(true)
        await handleLoadChildrenToParentNode(parentKey)
        setIsLoading(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  if (isPlaceholderNode({ type })) return null

  if (isPaginationNode({ type })) {
    return (
      <div
        key={uniqueKey}
        style={style}
        ref={ref}
        className={styles.paginationNode}
      >
        {isLoading && <Loader />}
      </div>
    )
  }

  const paddingLeft = 2 * TREE_NODE_PADDING * nestingLevel
  const additionalStyle = {
    paddingLeft,
    maxWidth: maxContainerWidth - paddingLeft,
  }

  const isLastLeafOfParent =
    isLeaf && nodesMap[parentKey]?.[childrenKey].length - 1 === index

  const handleExpand = async () => {
    onExpand?.(key, !isOpen)
    if (isOpen || selfControlled || !!data[childrenKey].length) {
      await setOpen(!isOpen)
      return
    }

    setIsLoading(true)
    await handleLoadChildrenToParentNode(key)
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

  function handleDragOver(e) {
    if (isLeaf) return
    onDragOver(e, data)
  }

  function handleDragStart(e) {
    if (isLeaf) return
    onDragStart(e)
  }

  function handleDragEnter(e) {
    if (isLeaf) return
    onDragEnter(e, data, () => {
      const hasChildren = !!data[childrenKey]?.length
      if (!isOpen && hasChildren) {
        handleExpand()
      }
    })
  }

  return (
    <div
      key={uniqueKey}
      style={style}
      id={uniqueKey}
      draggable={isDraggable && !isLeaf}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {content}
    </div>
  )
}

const determineDefaultHeight = (isParentNode, layer, nodeHeightsValues) => {
  const { leafNodeHeight, parentNodeHeight, rootNodeHeight } = nodeHeightsValues
  if (!isParentNode) return leafNodeHeight
  return layer === 0 ? rootNodeHeight : parentNodeHeight
}

const isParentNodeHasMoreChildren = ({
  currentChildrenAmount,
  totalChildrenAmount,
  hasMoreChildren,
}) => {
  if (Number.isInteger(totalChildrenAmount)) {
    return totalChildrenAmount > currentChildrenAmount
  }
  return hasMoreChildren
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

// We always need to yield at least one root node, but if we the list is empty (either no results or search query doesn't match any node)
// there is no node to yield, so there is a placeholder node.
const getPlaceholderNodeData = () => ({
  data: {
    id: PLACEHOLDER_NODE_ID,
    isLeaf: true,
    type: nodesListTypes.PLACEHOLDER,
    defaultHeight: 0,
  },
  nestingLevel: 0,
  node: {},
})

const getPaginationNodeData = ({ parentNodeId, nestingLevel, height }) => {
  const id = PAGINATION_NODE_ID(parentNodeId)
  return {
    data: {
      defaultHeight: height,
      parentKey: parentNodeId,
      uniqueKey: id,
      id,
      isLeaf: true,
      type: nodesListTypes.PAGINATION,
      nestingLevel,
    },
    nestingLevel,
    node: {},
  }
}

const buildTreeWalker = ({
  rootNodes,
  nodeHeightsValues,
  childrenKey,
  labelKey,
  hasMoreChildrenKey,
  totalChildrenKey,
}) =>
  function* treeWalker() {
    yield getPlaceholderNodeData()

    for (let i = 0; i < rootNodes.length; i++) {
      const node = rootNodes[i]
      if (!node.visible) continue
      yield getNodeData({
        node,
        nestingLevel: 0,
        nodeHeightsValues,
        labelKey,
      })
    }

    while (true) {
      const parentMeta = yield
      if (parentMeta.node.isParentNode) {
        const {
          [childrenKey]: children,
          [hasMoreChildrenKey]: hasMoreChildren,
          [totalChildrenKey]: totalChildrenAmount,
        } = parentMeta.node
        for (let i = 0; i < children.length; i++) {
          const childNode = children[i]
          if (!childNode.visible) continue
          yield getNodeData({
            node: childNode,
            nestingLevel: parentMeta.nestingLevel + 1,
            nodeHeightsValues,
            labelKey,
          })
        }

        if (
          children.length &&
          isParentNodeHasMoreChildren({
            currentChildrenAmount: children.length,
            totalChildrenAmount,
            hasMoreChildren,
          })
        ) {
          yield getPaginationNodeData({
            parentNodeId: parentMeta.node.uniqueKey,
            nestingLevel: parentMeta.nestingLevel + 1,
            height: PAGINATION_NODE_HEIGHT,
          })
        }
      }
    }
  }

const VirtualizedTreeList = ({
  setTreeInstance,
  rootNodes,
  renderNode,
  loadMoreData,
  isSearching,
  nodesMap,
  onExpand,
  nodeHeightsValues,
  selfControlled,
  handleLoadChildrenToParentNode,
  onDragItem,
  isDraggable,
  ...keyValues
}) => {
  const innerRef = useRef()
  const throttledLoadMoreData = useMemo(() => throttle(loadMoreData), [
    loadMoreData,
  ])

  const {
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  } = useTreeDragDrop({ onDropCallback: onDragItem, nodesMap })

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
            onDragItem,
            onDragStart,
            onDragEnter,
            onDragOver,
            onDragLeave,
            onDrop,
            onDragEnd,
            isDraggable,
            ...keyValues,
          }}
          treeWalker={buildTreeWalker({
            rootNodes,
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
  rootNodes: propTypes.array.isRequired,
  /** If true, search is controlled by the table component. Default is true.*/
  selfControlled: propTypes.bool,
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
  /** A function to handle addition of new nodes to a a parent node. */
  handleLoadChildrenToParentNode: propTypes.func,
  /** An object that contains the height of leaf nodes, parent nodes and root nodes. */
  nodeHeightsValues: propTypes.shape({
    leafNodeHeight: propTypes.number.isRequired,
    parentNodeHeight: propTypes.number.isRequired,
    rootNodeHeight: propTypes.number.isRequired,
  }),
}

export default VirtualizedTreeList
