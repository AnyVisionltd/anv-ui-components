import React, { useRef, useMemo, forwardRef } from 'react'
import propTypes from 'prop-types'
import { VariableSizeTree as TreeList } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'
import { throttle } from '../../../utils'
import styles from './VirtualizedTreeList.module.scss'

if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = require('resize-observer-polyfill').default
}

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
  forwardedRef,
}) => {
  const { nestingLevel, id } = data
  const content = renderNode(data, nestingLevel, {
    isOpen,
    handleExpand: toggle,
  })
  const paddingLeft = 2 * TREE_NODE_PADDING * nestingLevel
  const additionalStyle = {
    paddingLeft,
    maxWidth: maxContainerWidth - paddingLeft - SCROLLBAR_WIDTH,
  }

  // data-parentNodeId = parentKey
  // data-totalItems = total

  return (
    <div
      style={{
        ...style,
        ...additionalStyle,
      }}
      ref={forwardedRef}
      data-itemindex={id}
    >
      {content}
    </div>
  )
}

const RefForwardedNode = forwardRef((props, ref) => (
  <Node {...props} onWheel={handleOnWheel} forwardedRef={ref} />
))

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={event => handleOnWheel(event, props)} {...props} />
))

function getVisibleElements(element, currentScrollPosition) {
  //let allListItemsInDom = element.children[0].children;
  // var siblings = allListItemsInDom;
  var visibleItems = []
  let el = element.children[0].children[0]
  do {
    if (isVisibleInView(el, currentScrollPosition, element.clientHeight))
      visibleItems.push(el.getAttribute('data-itemindex'))
  } while ((el = el.nextSibling))
  return visibleItems
}

function isVisibleInView(element, scrollStart, clientHeight) {
  const elementTop = parseInt(element.style.top, 10)
  console.log('element top ', elementTop)
  if (
    elementTop > scrollStart &&
    elementTop + element.clientHeight < scrollStart + clientHeight
  ) {
    return true
  } else return false
}
function handleOnWheel({ currentTarget, deltaY, clientY }) {
  let currentScrollPosition = currentTarget.scrollTop
  console.log('current scroll position is ', currentScrollPosition)
  console.log(currentTarget)
  let visibleElements = getVisibleElements(currentTarget, currentScrollPosition)
  console.log(visibleElements)
  if (Math.abs(deltaY) < 3) console.log(visibleElements.toString())
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
          outerElementType={outerElementType}
        >
          {RefForwardedNode}
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
