import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Search } from '@anyvision/anv-icons'
import { Checkbox, InputBase, Tooltip } from '../../'
import { CheckboxWithIndeterminateState } from './CheckboxWithIndeterminateState'
import { VirtualizedTreeList } from './VirtualizedTreeList'
import { EmptyTreeSearch } from './EmptyTreeSearch'
import languageService from '../../services/language'
import useTreeVisibleData from './useTreeVisibleData'
import useFlattenTreeData from './useFlattenTreeData'
import { RootNode } from './RootNode'
import { TreeSkeletonLoading } from './TreeSkeletonLoading'
import {
  setNodesSelectedStatus,
  setNodesExpandedStatus,
  checkAllNodesAreExpanded,
  emptyListTypes,
  ALL_ROOTS_COMBINED_KEY,
  getNodeParents,
} from './utils'
import styles from './Tree.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const Tree = forwardRef(
  (
    {
      nodes,
      selectedKeys,
      className,
      nodesContainerClassName,
      isSearchable,
      isBulkActionsEnabled,
      onSearch,
      placeholder,
      onExpand,
      onSelect,
      renderLeaf,
      renderLeafRightSide,
      displayLabels,
      rootNodeActions,
      loadMoreData,
      maxNestingLevel,
      noItemsMessage,
      childrenKey,
      labelKey,
      idKey,
      isLoading,
      isChildrenUniqueKeysOverlap,
      isReturnSelectedKeysWhenOnSelect
    },
    ref,
  ) => {
    const [treeInstance, setTreeInstance] = useState(null)
    const [areAllNodesExpanded, setAreAllNodesExpanded] = useState(false)
    const nodesContainerRef = useRef()
    const [singularNounLabel, pluralNounLabel] = displayLabels
    const keyValues = { childrenKey, labelKey, idKey }

    const {
      searchQuery,
      handleSearch,
      filteredData,
      resetSearchData,
      handleAddNewNodes,
      handleSetNodeNewProperties,
    } = useTreeVisibleData({
      initialData: nodes,
      onSearch,
      treeInstance,
      isChildrenUniqueKeysOverlap,
      ...keyValues,
    })

    const {
      flattenedNodes,
      setFlattenedNodes,
      calculateAmountOfSelectedNodesAndChildren,
      updateAmountOfSelectedNodesAndChildren,
      handleAddNewFlattenedNodes,
      handleSetSelectedNodesFromKeysArr,
    } = useFlattenTreeData({
      data: nodes,
      selectedKeys,
      maxNestingLevel,
      isChildrenUniqueKeysOverlap,
      ...keyValues,
    })

    useImperativeHandle(
      ref,
      () => ({
        get nodesMap() {
          const { ALL_ROOTS_COMBINED_KEY, ...restNodes } = flattenedNodes
          return Object.freeze(restNodes)
        },
        setSelectedKeys: (keysToAdd, keysToRemove) =>
          handleSetSelectedNodesFromKeysArr(keysToAdd, keysToRemove),
        setNodeProperties: (nodeKey, newProperties) => {
          if (!flattenedNodes[nodeKey]) return
          const nodePathArr = getNodeParents(nodeKey, flattenedNodes)
          handleSetNodeNewProperties(nodeKey, newProperties, nodePathArr)
        },
      }),
      [
        flattenedNodes,
        handleSetNodeNewProperties,
        handleSetSelectedNodesFromKeysArr,
      ],
    )

    const {
      totalChildren: totalChildrenInTree,
      totalSelected: totalSelectedInTree,
    } = calculateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY)
    const areAllNodesSelected = totalChildrenInTree === totalSelectedInTree

    const handleIsSelected = (node, isCurrentlySelected) => {
      const { keys: keysToToggle, nodesMap } = setNodesSelectedStatus({
        nodesTree: Array.isArray(node) ? node : [node],
        nodesMap: { ...flattenedNodes },
        isSelected: !isCurrentlySelected,
        childrenKey,
        isChildrenUniqueKeysOverlap
      })

      setFlattenedNodes(nodesMap)
      updateAmountOfSelectedNodesAndChildren(
        Array.isArray(node) ? ALL_ROOTS_COMBINED_KEY : node.uniqueKey,
      )
      // Add isReturn

      // if (isReturnSelectedKeysWhenOnSelect) {
        
      // }

      onSelect(keysToToggle)
    }

    useEffect(() => {
      if (filteredData.length < nodes.length) {
        const newAddedNodes = nodes.slice(filteredData.length)
        handleAddNewNodes(newAddedNodes)
        handleAddNewFlattenedNodes(newAddedNodes)
      }
    }, [filteredData, handleAddNewFlattenedNodes, handleAddNewNodes, nodes])

    useEffect(() => {
      const areAllExpanded = checkAllNodesAreExpanded({
        nodesTree: filteredData,
        nodesVirualizedMap: treeInstance?.state?.records,
        childrenKey,
      })

      areAllExpanded !== areAllNodesExpanded &&
        setAreAllNodesExpanded(areAllExpanded)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flattenedNodes])

    const handleBulkExpandCollapse = () => {
      if (treeInstance) {
        const allExpandedCollapsedNodesObj = setNodesExpandedStatus({
          nodesTree: filteredData,
          isOpen: !areAllNodesExpanded,
          childrenKey,
        })
        treeInstance.state.recomputeTree({
          opennessState: allExpandedCollapsedNodesObj,
          refreshNodes: true,
        })
        setAreAllNodesExpanded(!areAllNodesExpanded)
      }
    }

    const handleLoadMoreData = useCallback(async () => {
      const newNodes = await loadMoreData()
      if (!newNodes) return
      handleAddNewNodes(newNodes)
      handleAddNewFlattenedNodes(newNodes)
    }, [handleAddNewFlattenedNodes, handleAddNewNodes, loadMoreData])

    const isTreeEmpty = () => {
      if (!nodes.length) return true
      if (!searchQuery) return false
      return !filteredData.some(node => node.visible)
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

    const renderBulkActions = () => (
      <div className={styles.bulkActions}>
        <div className={styles.bulkSelectContainer}>
          <Checkbox
            checked={areAllNodesSelected}
            onChange={() => handleIsSelected(filteredData, areAllNodesSelected)}
            className={styles.checkbox}
            id='bulk-select-tree'
          />
          <label htmlFor='bulk-select-tree' className={styles.bulkSelectLabel}>
            {getTranslation(areAllNodesSelected ? 'selectNone' : 'selectAll')}
          </label>
        </div>
        <div className={styles.bulkExpand} onClick={handleBulkExpandCollapse}>
          {getTranslation(areAllNodesExpanded ? 'collapseAll' : 'expandAll')}
        </div>
      </div>
    )

    const getParentNodeClasses = (nestingLevel, isOpen) => {
      const containerClasses = classNames(styles.parentNodeContainer, {
        [styles.rootNodeContainer]: nestingLevel === 0,
      })
      const wrapperClasses = classNames(styles.parentNodeWrapper, {
        [styles.rootNodeWrapper]: nestingLevel === 0,
        [styles.isNotExpanded]: !isOpen,
      })
      return { containerClasses, wrapperClasses }
    }

    const getParentNodeInfo = (totalChildren, totalSelected) =>
      `${totalChildren} ${
        totalChildren === 1 ? singularNounLabel : pluralNounLabel
      } | ${totalSelected} ${getTranslation('selected')}`

    const renderParentNode = (
      node,
      virtualizedListProps,
      rootNodeProps = {},
    ) => {
      const {
        [labelKey]: label,
        [childrenKey]: children,
        uniqueKey,
        nestingLevel,
      } = node
      const { isOpen, handleExpand, style } = virtualizedListProps
      const { renderActions } = rootNodeProps
      const {
        totalSelected = 0,
        totalChildren = children.length,
      } = calculateAmountOfSelectedNodesAndChildren(uniqueKey)
      const isSelected = !!totalChildren && totalSelected === totalChildren

      const infoText = getParentNodeInfo(totalChildren, totalSelected)

      const { containerClasses, wrapperClasses } = getParentNodeClasses(
        nestingLevel,
        isOpen,
      )

      return (
        <div className={containerClasses} key={uniqueKey}>
          <div className={wrapperClasses}>
            <div style={style} className={styles.parentNode}>
              <Checkbox
                disabled={!totalChildren}
                checked={isSelected}
                onChange={() => handleIsSelected(node, isSelected)}
                className={classNames(
                  styles.isSelectedCheckbox,
                  styles.checkbox,
                )}
              />
              <Tooltip content={label} overflowOnly>
                <p className={styles.parentLabel}>{label}</p>
              </Tooltip>
              <div className={styles.parentNodeContent}>
                <div className={styles.parentNodeInfo}>
                  <CheckboxWithIndeterminateState
                    disabled={!totalChildren}
                    checked={isOpen}
                    onChange={handleExpand}
                    className={styles.checkbox}
                  />
                  <p className={styles.parentInfoText}>{infoText}</p>
                </div>
              </div>
            </div>
          </div>
          {!!renderActions && renderActions(node)}
        </div>
      )
    }

    const getLeafNodeClasses = isLastLeaf => {
      const containerClasses = classNames(styles.leafNodeContainer, {
        [styles.lastLeafNodeContainer]: isLastLeaf,
      })
      const leafNodeClasses = classNames(styles.leafNode, {
        [styles.lastLeafNode]: isLastLeaf,
      })
      return { containerClasses, leafNodeClasses }
    }

    const renderLeafNode = (node, virtualizedListProps = {}) => {
      const { uniqueKey, [labelKey]: label } = node
      const { style, isLastLeaf } = virtualizedListProps
      const isSelected = flattenedNodes[uniqueKey]?.isSelected

      const { containerClasses, leafNodeClasses } = getLeafNodeClasses(
        isLastLeaf,
      )

      return (
        <div className={containerClasses} key={uniqueKey}>
          <div style={style} className={styles.leafNodeWrapper}>
            {renderLeaf ? (
              renderLeaf(node)
            ) : (
              <div className={leafNodeClasses}>
                <div className={styles.leftSideLeaf}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleIsSelected(node, isSelected)}
                    className={styles.checkbox}
                  />
                  <Tooltip content={label} overflowOnly>
                    <p className={styles.leafLabel}>{label}</p>
                  </Tooltip>
                </div>
                {renderLeafRightSide && renderLeafRightSide(node)}
              </div>
            )}
          </div>
        </div>
      )
    }

    const renderNode = (node, layer, virtualizedListProps) => {
      const { [childrenKey]: children } = node
      if (!children) return renderLeafNode(node, virtualizedListProps)
      if (layer === 0 && rootNodeActions.length) {
        return (
          <RootNode
            renderNode={rootNodeProps =>
              renderParentNode(node, virtualizedListProps, rootNodeProps)
            }
            menuActions={rootNodeActions}
          />
        )
      }
      return renderParentNode(node, virtualizedListProps)
    }

    const renderEmptyTree = () => (
      <EmptyTreeSearch
        type={
          nodes.length
            ? emptyListTypes.NO_RESULTS_FOUND
            : emptyListTypes.NO_ITEMS_IN_LIST
        }
        onClearSearch={resetSearchData}
        noItemsMessage={noItemsMessage}
      />
    )

    const renderVirtualizedTreeList = () => (
      <VirtualizedTreeList
        setTreeInstance={setTreeInstance}
        rootNode={{ ...filteredData }}
        renderNode={renderNode}
        loadMoreData={handleLoadMoreData}
        isSearching={!!searchQuery.length}
        nodesMap={flattenedNodes}
        onExpand={onExpand}
        {...keyValues}
      />
    )

    const renderTreeSkeleton = () => (
      <TreeSkeletonLoading containerRef={nodesContainerRef} />
    )

    const renderTree = () => (
      <>
        {isEmpty && renderEmptyTree()}
        {renderVirtualizedTreeList()}
      </>
    )

    const isEmpty = isTreeEmpty()

    console.log(treeInstance?.state)

    return (
      <div className={classNames(styles.tree, className)}>
        {isSearchable && !!nodes.length && renderSearchInput()}
        {isBulkActionsEnabled && !isEmpty && renderBulkActions()}
        <div
          ref={nodesContainerRef}
          className={classNames(styles.nodesContainer, nodesContainerClassName)}
        >
          {isLoading ? renderTreeSkeleton() : renderTree()}
        </div>
      </div>
    )
  },
)

Tree.defaultProps = {
  nodes: [],
  selectedKeys: [],
  onSearch: () => {},
  onSelect: () => {},
  onExpand: () => {},
  placeholder: getTranslation('search'),
  displayLabels: [getTranslation('item'), getTranslation('items')],
  isSearchable: true,
  isBulkActionsEnabled: true,
  rootNodeActions: [],
  loadMoreData: () => {},
  maxNestingLevel: -1,
  noItemsMessage: getTranslation('listIsEmpty'),
  childrenKey: 'children',
  labelKey: 'label',
  idKey: 'key',
}

Tree.propTypes = {
  /** Nodes of the tree. If a node has children, it's a parent node, else it's a leaf node. */
  nodes: propTypes.array,
  /** Selected nodes in the tree, each item has his unique key. */
  selectedKeys: propTypes.oneOfType([propTypes.array, propTypes.object]),
  /** The key value of the node's children property. Default is 'children'. */
  childrenKey: propTypes.string,
  /** The key value of the node's unique id property. Default is 'key'. */
  idKey: propTypes.string,
  /** The key value of the node's name property. Default is 'label'. */
  labelKey: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
  /** For css customization. */
  nodesContainerClassName: propTypes.string,
  /** Enable search. */
  isSearchable: propTypes.bool,
  /** Called when user types in the search input. */
  onSearch: propTypes.func,
  /** Placeholder for search input. */
  placeholder: propTypes.string,
  /** Enable bulk actions functionality. */
  isBulkActionsEnabled: propTypes.bool,
  /** Called when a tree parent node is displayed. */
  onExpand: propTypes.func,
  /** Callback function after selecting / unselecteing tree node or nodes. */
  onSelect: propTypes.func,
  /** Custom render for the whole leaf node row. */
  renderLeaf: propTypes.func,
  /** Custom render for the right side of leaf node. */
  renderLeafRightSide: propTypes.func,
  /** Display labels that describe the name in singular [0] and plural [1] nouns, default is ['Item', 'Items']. */
  displayLabels: propTypes.arrayOf(propTypes.string),
  /** If passed, menu will be rendered for each main root node in the tree, in addition to search action. */
  rootNodeActions: propTypes.arrayOf(
    propTypes.shape({
      /** The label to render inside the <Menu.Items/>. */
      label: propTypes.string,
      /** The icon to render before the label. */
      icon: propTypes.node,
      /** The callback when click the <Menu.Items/> */
      onClick: propTypes.func,
      /** A callback function that returns a bool value that determines if the specific root's action should be rendered */
      hidden: propTypes.func,
    }),
  ),
  /** A callback that is called when more data needs to be fetched. */
  loadMoreData: propTypes.func,
  /** Maximum nesting level of a tree - used to stop at a specified level in order to improve performance.
   * Default is -1, meaning that maxNestingLevel is undefined. */
  maxNestingLevel: propTypes.number,
  /** Text to display when there are no items in tree. */
  noItemsMessage: propTypes.string,
  /** Tree loading status. */
  isLoading: propTypes.bool,
  /** Whether the tree roots can have the same child node without causing unique key conflicts.  */
  isChildrenUniqueKeysOverlap: propTypes.bool,
  /** If there is no need to make changes with selected/added nodes, set the prop to true to get the selectedKeys structure.  */
  isReturnSelectedKeysWhenOnSelect: propTypes.bool,
}

export default Tree
