import React from 'react'
import propTypes from 'prop-types'
import { VariableSizeTree as TreeList } from 'react-vtree'
import AutoSizer from 'react-virtualized-auto-sizer'
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

const buildTreeWalker = rootNode =>
  function* treeWalker(refresh) {
    const stack = Object.values(rootNode).map(node => ({
      nestingLevel: 0,
      node,
    }))

    while (stack.length) {
      const { node, nestingLevel } = stack.shift()
      const { isParentNode, key, label, children, visible } = node

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

      if (Array.isArray(children) && isOpened) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.unshift({
            nestingLevel: nestingLevel + 1,
            node: children[i],
          })
        }
      }
    }
  }

const VirtualizedTreeList = ({ setTreeInstance, rootNode, renderNode }) => (
  <AutoSizer>
    {({ height, width }) => (
      <TreeList
        className={styles.virtualizedTree}
        ref={setTreeInstance}
        itemData={{
          renderNode,
          maxContainerWidth: width,
        }}
        treeWalker={buildTreeWalker(rootNode)}
        height={height}
        width={width}
      >
        {Node}
      </TreeList>
    )}
  </AutoSizer>
)

VirtualizedTreeList.defaultProps = {
  renderNode: () => {},
  setTreeInstance: () => {},
}

VirtualizedTreeList.propTypes = {
  /** Tree structure needed for rendering the tree list. */
  rootNode: propTypes.objectOf(
    propTypes.shape({
      key: propTypes.any.isRequired,
      label: propTypes.string.isRequired,
      children: propTypes.array,
    }),
  ).isRequired,
  /** Render function for the nodes of the tree. */
  renderNode: propTypes.func,
  /** Set ref to the list component, so it can be accessible in Tree component. */
  setTreeInstance: propTypes.func,
}

export default VirtualizedTreeList
