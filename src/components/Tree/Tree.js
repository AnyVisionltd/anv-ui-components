import React, { useCallback } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Search } from '@anyvision/anv-icons'
import { Checkbox, InputBase } from '../../'
import languageService from '../../services/language'
import useTreeVisibleData from './useTreeVisibleData'
import useFlattenTreeData from './useFlattenTreeData'
import { setNodesSelectedStatus } from './utils'
import styles from './Tree.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const Tree = ({
  nodes,
  selectedKeys,
  className,
  isSearchable,
  isBulkActionsEnabled,
  onSearch,
  placeholder,
  onParentClick,
  onLeafClick,
  renderLeaf,
  renderLeafRightSide,
  displayLabels,
}) => {
  const [singularNounLabel, pluralNounLabel] = displayLabels

  const {
    searchQuery,
    handleSearch,
    filteredData,
    setFilteredData,
  } = useTreeVisibleData({ initialData: nodes, onSearch })

  const {
    flattenNodes,
    setFlattenNodes,
    calculateAmountOfSelectedNodesAndChildren,
    areAllNodesExpanded,
    areAllNodesSelected,
  } = useFlattenTreeData({
    data: nodes,
    selectedKeys,
  })

  const handleIsSelected = (node, isChild) => {
    const { key } = node
    const onClick = isChild ? onLeafClick : onParentClick
    const isCurrentlySelected = flattenNodes[key].isSelected
    const { keys: keysToToggle } = setNodesSelectedStatus(
      [node],
      flattenNodes,
      !isCurrentlySelected,
    )

    let newSelectedKeys

    if (isCurrentlySelected) {
      newSelectedKeys = selectedKeys.filter(key => !keysToToggle.includes(key))
    } else {
      newSelectedKeys = [...new Set([...selectedKeys, ...keysToToggle])]
    }

    onClick(newSelectedKeys)
  }

  const handleIsExpanded = ({ key }) => {
    setFlattenNodes(prevNodes => ({
      ...prevNodes,
      [key]: { ...prevNodes[key], isExpanded: !prevNodes[key].isExpanded },
    }))
  }

  const handleBulkSelect = useCallback(() => {
    const newFlattenNodes = { ...flattenNodes }
    const newIsSelectedValue = areAllNodesSelected ? false : true

    Object.values(newFlattenNodes).forEach(node => {
      node.isSelected = newIsSelectedValue
    })

    setFlattenNodes(newFlattenNodes)
  }, [flattenNodes, setFlattenNodes, areAllNodesSelected])

  const handleBulkExpandCollapse = useCallback(() => {
    const newFlattenNodes = { ...flattenNodes }
    const newIsExpandedValue = areAllNodesExpanded ? false : true

    Object.values(newFlattenNodes).forEach(node => {
      if (Array.isArray(node.children)) {
        node.isExpanded = newIsExpandedValue
      }
    })

    setFlattenNodes(newFlattenNodes)
  }, [flattenNodes, setFlattenNodes, areAllNodesExpanded])

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

  const renderBulkActions = () => (
    <div className={styles.bulkActions}>
      <div className={styles.bulkSelectContainer}>
        <Checkbox
          checked={areAllNodesSelected}
          onChange={handleBulkSelect}
          className={styles.checkbox}
          id='bulk-select-tree'
        />
        <label htmlFor='bulk-select-tree' className={styles.bulkSelectLabel}>
          {getTranslation('selectAll')}
        </label>
      </div>
      <div className={styles.bulkExpand} onClick={handleBulkExpandCollapse}>
        {getTranslation(areAllNodesExpanded ? 'collapseAll' : 'expandAll')}
      </div>
    </div>
  )

  const renderParentNode = (node, layer) => {
    const { key, label, children } = node
    const isExpanded = flattenNodes[key]?.isExpanded
    const isSelected = flattenNodes[key]?.isSelected
    const {
      totalSelected = 0,
      totalChildren = children.length,
    } = calculateAmountOfSelectedNodesAndChildren(key, flattenNodes)

    const infoText = `${children.length} ${
      children.length === 1 ? singularNounLabel : pluralNounLabel
    } | ${totalSelected} ${getTranslation('selected')}`

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
          checked={totalSelected === totalChildren}
          onChange={() => handleIsSelected(node)}
          className={styles.isSelectedCheckbox}
        />
        <p className={styles.parentLabel}>{label}</p>
        <div className={styles.parentNodeContent}>
          <div className={styles.parentNodeInfo}>
            <Checkbox
              toggled
              checked={isExpanded}
              onChange={() => handleIsExpanded(node)}
              className={styles.checkbox}
            />
            <p className={styles.parentInfoText}>{infoText}</p>
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
    const isSelected = flattenNodes[key]?.isSelected

    return renderLeaf ? (
      renderLeaf(node)
    ) : (
      <div className={styles.leafNode} key={key}>
        <div className={styles.leftSideLeaf}>
          <Checkbox
            checked={isSelected}
            onChange={() => handleIsSelected(node, true)}
            className={styles.checkbox}
          />
          <p className={styles.leafLabel}>{label}</p>
        </div>
        {renderLeafRightSide && renderLeafRightSide(node)}
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
      {isBulkActionsEnabled && renderBulkActions()}
      <div className={styles.nodesContainer}>
        {filteredData.map(node => renderNode(node))}
      </div>
    </div>
  )
}

Tree.defaultProps = {
  nodes: [],
  selectedKeys: [],
  onSearch: () => {},
  onParentClick: () => {},
  onLeafClick: () => {},
  placeholder: getTranslation('search'),
  displayLabels: [getTranslation('item'), getTranslation('items')],
  isSearchable: true,
  isBulkActionsEnabled: true,
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
  selectedKeys: propTypes.arrayOf(propTypes.any),
  /** For css customization. */
  className: propTypes.string,
  /** Enable search. */
  isSearchable: propTypes.bool,
  /** Called when user types in the search input. */
  onSearch: propTypes.func,
  /** Placeholder for search input. */
  placeholder: propTypes.string,
  /** Enable bulk actions functionality. */
  isBulkActionsEnabled: propTypes.bool,
  /** Called when parent node is clicked. */
  onParentClick: propTypes.func,
  /** Called when leaf node is clicked. */
  onLeafClick: propTypes.func,
  /** Custom render for the whole leaf node row. */
  renderLeaf: propTypes.func,
  /** Custom render for the right side of leaf node. */
  renderLeafRightSide: propTypes.func,
  /** Display labels that describe the name in singular [0] and plural [1] nouns, default is ['Item', 'Items']. */
  displayLabels: propTypes.arrayOf(propTypes.string),
}

export default Tree
