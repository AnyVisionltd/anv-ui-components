import React, { useRef, useMemo } from 'react'
import propTypes from 'prop-types'
import { VariableSizeTree as TreeList } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'
import { throttle } from '../../../utils'
import styles from './VirtualizedTreeList.module.scss'

const TREE_NODE_PADDING = 24
const SCROLLBAR_WIDTH = 16
const LEAF_NODE_HEIGHT = 48
const PARENT_NODE_HEIGHT = 78

const Node = ({
  data,
  isOpen,
  style,
  toggle,
  treeData: { renderNode, maxContainerWidth },
}) => {
  const { nestingLevel } = data
  const content = renderNode(data, nestingLevel, {
    isOpen,
    handleExpand: toggle,
  })
  const paddingLeft = 2 * TREE_NODE_PADDING * nestingLevel
  const additionalStyle = {
    paddingLeft,
    maxWidth: maxContainerWidth - paddingLeft - SCROLLBAR_WIDTH,
  }

  return (
    <div
      style={{
        ...style,
        ...additionalStyle,
      }}
    >
      {content}
    </div>
  )
}

const buildTreeWalker = ({ rootNode, childrenKey, idKey, labelKey }) =>
  function* treeWalker(refresh) {
    const stack = Object.values(rootNode).map(node => ({
      nestingLevel: 0,
      node,
    }))

    while (stack.length) {
      const { node, nestingLevel } = stack.shift()
      const {
        isParentNode,
        [idKey]: key,
        [labelKey]: label,
        [childrenKey]: children,
        visible,
      } = node

      if (!visible) continue

      const isOpened = yield refresh
        ? {
            defaultHeight: isParentNode ? PARENT_NODE_HEIGHT : LEAF_NODE_HEIGHT,
            isOpenByDefault: false,
            id: key,
            name: label,
            isLeaf: !isParentNode,
            nestingLevel,
            ...node,
          }
        : key

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
          }}
          treeWalker={buildTreeWalker({ rootNode, ...keyValues })}
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
}

VirtualizedTreeList.propTypes = {
  /** Tree structure needed for rendering the tree list. */
  rootNode: propTypes.object.isRequired,
  /** Render function for the nodes of the tree. */
  renderNode: propTypes.func,
  /** Set ref to the list component, so it can be accessible in Tree component. */
  setTreeInstance: propTypes.func,
  /** A callback that is called when more data needs to be fetched. */
  loadMoreData: propTypes.func,
  /** Wether user is searching or not. */
  isSearching: propTypes.bool,
}

export default VirtualizedTreeList
