import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Search } from '@anyvision/anv-icons'
import { Tooltip, Checkbox, InputBase } from '../../'
import languageService from '../../services/language'
import useTreeVisibleData from './useTreeVisibleData'
import { getNodeParents, getChildrenKeys } from './utils'
import styles from './Tree.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const Tree = ({
  nodes,
  selectedKeys,
  className,
  isSearchable,
  onSearch,
  placeholder,
  onParentClick,
  onLeafClick,
  renderLeaf,
  rightSideRenderLeaf,
}) => {
  const [selectedNodes, setSelectedNodes] = useState({})
  const [expandedNodes, setExpandedNodes] = useState({})

  const {
    searchQuery,
    handleSearch,
    filteredData,
    setFilteredData,
  } = useTreeVisibleData({ initialData: nodes, onSearch })

  console.log(filteredData)

  const flattenTree = () => {}

  const onSetSelectedCheckboxClick = ({ key, children }, isChild) => {
    const onClick = isChild ? onLeafClick : onParentClick
    const isSelected = selectedKeys.includes(key)
    const keysToToggle = isChild ? [key] : [key, ...getChildrenKeys(children)]
    let newSelectedKeys

    if (isSelected) {
      newSelectedKeys = selectedKeys.filter(key => !keysToToggle.includes(key))
    } else {
      newSelectedKeys = [...new Set([...selectedKeys, ...keysToToggle])]
    }

    onClick(newSelectedKeys)
  }

  const onToggleVisibilityCheckboxClick = ({ key }) => {
    const newExpandedNodes = { ...expandedNodes }
    if (newExpandedNodes[key]) {
      delete newExpandedNodes[key]
    } else {
      newExpandedNodes[key] = key
    }
    setExpandedNodes(newExpandedNodes)
  }

  const renderSearchInput = () => (
    <InputBase
      placeholder={placeholder}
      className={styles.searchInput}
      trailingIcon={<Search />}
      trailingIconClassName={styles.searchIcon}
      onChange={handleSearch}
      value={searchQuery}
    />
  )

  const renderParentNode = (node, layer) => {
    const { key, label, children } = node
    const isExpanded = !!expandedNodes[key]
    const isSelected = selectedKeys.includes(key)

    return (
      <div
        className={classNames(styles.parentNode, {
          [styles.root]: layer === 0,
          [styles.isHoverBackground]: !isExpanded,
          [styles.isNotSelected]: !isSelected,
        })}
        key={key}
      >
        <Checkbox
          checked={isSelected}
          onChange={() => onSetSelectedCheckboxClick(node)}
          className={styles.isSelectedCheckbox}
        />
        <p className={styles.parentLabel}>{label}</p>
        <div className={styles.parentNodeContent}>
          <div className={styles.parentNodeInfo}>
            <Checkbox
              toggled
              checked={isExpanded}
              onChange={() => onToggleVisibilityCheckboxClick(node)}
              className={styles.checkbox}
            />
            <p className={styles.parentInfoText}>
              {children.length} Cameras | {children.length} Selected
            </p>
          </div>
          {isExpanded && (
            <div className={styles.parentNodeChildrenList}>
              {children.map(nodeChild => renderNode(nodeChild, layer + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderLeafNode = node => {
    const { key, label } = node
    const isSelected = selectedKeys.includes(key)

    return renderLeaf ? (
      renderLeaf(node)
    ) : (
      <div className={styles.leafNode} key={key}>
        <div className={styles.leftSideLeaf}>
          <Checkbox
            checked={isSelected}
            onChange={() => onSetSelectedCheckboxClick(node, true)}
          />
          <p className={styles.leafLabel}>{label}</p>
        </div>
        {rightSideRenderLeaf && rightSideRenderLeaf(node)}
      </div>
    )
  }

  const renderNode = (node, layer = 0) => {
    const { children, visible } = node
    if (!visible) return null
    if (children) return renderParentNode(node, layer)
    return renderLeafNode(node)
  }

  return (
    <div className={classNames(styles.tree, className)}>
      {isSearchable && renderSearchInput()}
      <div className={styles.nodesContainer}>
        {filteredData.map(node => renderNode(node))}
      </div>
    </div>
  )
}

Tree.defaultProps = {
  items: [],
  selectedKeys: [],
  onSearch: () => {},
  onParentClick: () => {},
  onLeafClick: () => {},
  placeholder: getTranslation('search'),
  displayLabels: [getTranslation('item'), getTranslation('items')],
}

Tree.propTypes = {
  /** Nodes of the tree. If a node has children, it's a parent node, else it's a leaf node. */
  nodes: propTypes.arrayOf(
    propTypes.shape({
      key: propTypes.oneOf([propTypes.number, propTypes.string]).isRequired,
      label: propTypes.string.isRequired,
      children: propTypes.array,
    }),
  ),
  /** Selected nodes in the tree, each item has his unique key. */
  selectedKeys: propTypes.arrayOf(
    propTypes.oneOf([propTypes.number, propTypes.string]),
  ),
  /** For css customization. */
  className: propTypes.string,
  /** Enable search. */
  isSearchable: propTypes.bool,
  /** Called when user types in the search input. */
  onSearch: propTypes.func,
  /** Placeholder for search input. */
  placeholder: propTypes.string,
  /** Called when parent node is clicked. */
  onParentClick: propTypes.func,
  /** Called when leaf node is clicked. */
  onLeafClick: propTypes.func,
  /** Custom render for the whole leaf node row. */
  renderLeaf: propTypes.func,
  /** Custom render for the right side of leaf node. */
  rightSideLeafRender: propTypes.func,
  /** Display labels that describe the name in singular [0] and plural [1] nouns, default is ['Item', 'Items']. */
  displayLabels: propTypes.arrayOf(propTypes.string),
}

export default Tree
