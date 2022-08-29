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
  organizeSelectedKeys,
} from './utils'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import styles from './Tree.module.scss'

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
      totalLeavesKey,
      isLoading,
      isChildrenUniqueKeysOverlap,
      isReturnSelectedKeysWhenOnSelect,
      isReturnWholeNodeDataWhenOnSelect,
      selfControlled,
      totalRootNodes,
    },
    ref,
  ) => {
    const { getComponentTranslation } = useComponentTranslation()
    const TreeTranslations = getComponentTranslation('tree')
    const defaultDisplayLabels = [TreeTranslations.item, TreeTranslations.items]
    const [treeInstance, setTreeInstance] = useState(null)
    const [areAllNodesExpanded, setAreAllNodesExpanded] = useState(false)
    const nodesContainerRef = useRef()
    const [singularNounLabel, pluralNounLabel] =
      displayLabels || defaultDisplayLabels
    const keyValues = { childrenKey, labelKey, idKey, totalLeavesKey }

    const {
      searchQuery,
      handleSearch,
      filteredData,
      resetSearchData,
      handleAddNewNodes,
      handleSetNodeNewProperties,
      handleSetNewNodes,
    } = useTreeVisibleData({
      initialData: nodes,
      onSearch,
      treeInstance,
      isChildrenUniqueKeysOverlap,
      selfControlled,
      ...keyValues,
    })

    const {
      flattenedNodes,
      setFlattenedNodes,
      calculateAmountOfSelectedNodesAndChildren,
      calculateTotalSelectedAndChildrenOfAllNodes,
      updateAmountOfSelectedNodesAndChildren,
      handleAddNewFlattenedNodes,
      handleSetSelectedNodesFromKeysArr,
      handleSetSelectedNodesFromKeysObject,
      isSelectedKeysUpdatedAfterMount,
      flattenTreeData,
      handleIsNodeSelectedWithExclusion,
      handleOnSelectWithExclusion,
      handleIsAllNodesAreSelectedWithExclusion,
    } = useFlattenTreeData({
      data: nodes,
      selectedKeys,
      maxNestingLevel,
      isChildrenUniqueKeysOverlap,
      selfControlled,
      totalRootNodes,
      ...keyValues,
    })

    useImperativeHandle(
      ref,
      () => ({
        get nodesMap() {
          const { ALL_ROOTS_COMBINED_KEY, ...restNodes } = flattenedNodes
          return Object.freeze(restNodes)
        },
        setSelectedKeys: ({ keysToAdd = [], keysToRemove = [] }) => {
          if (isChildrenUniqueKeysOverlap)
            handleSetSelectedNodesFromKeysObject(keysToAdd, keysToRemove)
          else handleSetSelectedNodesFromKeysArr(keysToAdd, keysToRemove)
        },
        setNodeProperties: (nodeKey, newProperties) => {
          if (!flattenedNodes[nodeKey]) return
          const nodePathArr = getNodeParents(nodeKey, flattenedNodes)
          handleSetNodeNewProperties(nodeKey, newProperties, nodePathArr)
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [flattenedNodes],
    )

    const {
      totalChildren: totalChildrenInTree,
      totalSelected: totalSelectedInTree,
    } = calculateTotalSelectedAndChildrenOfAllNodes()
    const areAllNodesSelected = selfControlled
      ? totalChildrenInTree === totalSelectedInTree
      : handleIsAllNodesAreSelectedWithExclusion()

    const handleOnSelectWithExclusionMode = ({ nodeKey, isSelected }) => {
      const newSelectionData = handleOnSelectWithExclusion({
        nodeKey,
        isSelected,
      })
      updateAmountOfSelectedNodesAndChildren(nodeKey)
      onSelect(newSelectionData)
    }

    const handleOnSelect = (node, isCurrentlySelected) => {
      const nodeKey = Array.isArray(node)
        ? ALL_ROOTS_COMBINED_KEY
        : node.uniqueKey
      if (!selfControlled) {
        handleOnSelectWithExclusionMode({
          nodeKey,
          isSelected: !isCurrentlySelected,
        })
        return
      }

      const { keys: keysToToggle, nodesMap } = setNodesSelectedStatus({
        nodesTree: Array.isArray(node) ? node : [node],
        nodesMap: { ...flattenedNodes },
        isSelected: !isCurrentlySelected,
        childrenKey,
        idKey,
        isChildrenUniqueKeysOverlap,
        isReturnWholeNodeDataWhenOnSelect,
      })

      setFlattenedNodes(nodesMap)
      updateAmountOfSelectedNodesAndChildren(nodeKey)

      if (
        isReturnSelectedKeysWhenOnSelect &&
        !isReturnWholeNodeDataWhenOnSelect
      ) {
        const newSelectedKeys = organizeSelectedKeys({
          isChildrenUniqueKeysOverlap,
          keysToToggle,
          selectedKeys,
        })
        onSelect(newSelectedKeys, keysToToggle)
      } else {
        onSelect(keysToToggle)
      }
    }

    useEffect(() => {
      if (!selfControlled && !isLoading) {
        // No more need in calculating the leaves in flattenedNodes
        handleSetNewNodes(nodes)
        flattenTreeData(nodes, selectedKeys)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, selfControlled])

    useEffect(() => {
      if (selfControlled && filteredData.length < nodes.length) {
        const newAddedNodes = nodes.slice(filteredData.length)
        handleAddNewNodes(newAddedNodes)
        handleAddNewFlattenedNodes(newAddedNodes)
      }
    }, [
      filteredData,
      handleAddNewFlattenedNodes,
      handleAddNewNodes,
      nodes,
      selfControlled,
    ])

    useEffect(() => {
      const areAllExpanded = checkAllNodesAreExpanded({
        nodesTree: filteredData,
        nodesVirtualizedMap: treeInstance?.state?.records,
        childrenKey,
      })

      areAllExpanded !== areAllNodesExpanded &&
        setAreAllNodesExpanded(areAllExpanded)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flattenedNodes])

    useEffect(() => {
      if (
        selfControlled &&
        totalSelectedInTree &&
        !selectedKeys.length &&
        isSelectedKeysUpdatedAfterMount.current
      ) {
        const { nodesMap } = setNodesSelectedStatus({
          nodesTree: filteredData,
          nodesMap: { ...flattenedNodes },
          isSelected: false,
          childrenKey,
          idKey,
          isChildrenUniqueKeysOverlap,
        })

        setFlattenedNodes(nodesMap)
        updateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeys])

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
      if (!searchQuery || !selfControlled) return false
      return !filteredData.some(node => node.visible)
    }

    const renderSearchInput = () => (
      <InputBase
        placeholder={placeholder || TreeTranslations.search}
        className={styles.searchInput}
        trailingIcon={<Search />}
        trailingIconClassName={styles.searchIcon}
        onChange={handleSearch}
        value={searchQuery}
        useClearTextIcon
      />
    )

    const renderBulkActions = () => (
      <div className={styles.bulkActions}>
        <div className={styles.bulkSelectContainer}>
          <Checkbox
            checked={areAllNodesSelected}
            onChange={() => handleOnSelect(filteredData, areAllNodesSelected)}
            className={styles.checkbox}
            id='bulk-select-tree'
          />
          <label htmlFor='bulk-select-tree' className={styles.bulkSelectLabel}>
            {areAllNodesSelected
              ? TreeTranslations.selectNone
              : TreeTranslations.selectAll}
          </label>
        </div>
        <div className={styles.bulkExpand} onClick={handleBulkExpandCollapse}>
          {areAllNodesExpanded
            ? TreeTranslations.collapseAll
            : TreeTranslations.expandAll}
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
      } | ${totalSelected} ${TreeTranslations.selected}`

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
                onChange={() => handleOnSelect(node, isSelected)}
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

    const handleIsLeafNodeSelected = uniqueKey => {
      if (selfControlled) {
        return flattenedNodes[uniqueKey]?.isSelected
      }
      return handleIsNodeSelectedWithExclusion(uniqueKey)
    }

    const renderLeafNode = (node, virtualizedListProps = {}) => {
      const { uniqueKey, [labelKey]: label } = node
      const { style, isLastLeaf } = virtualizedListProps
      const isSelected = handleIsLeafNodeSelected(uniqueKey)

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
                    onChange={() => handleOnSelect(node, isSelected)}
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
        noItemsMessage={noItemsMessage || TreeTranslations.listIsEmpty}
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

    const isEmpty = isTreeEmpty()

    const renderTree = () => (
      <>
        {isEmpty && renderEmptyTree()}
        {renderVirtualizedTreeList()}
      </>
    )

    const shouldRenderSearchInput = () => {
      if (!isSearchable) return false
      return !!nodes.length || !!searchQuery
    }

    return (
      <div className={classNames(styles.tree, className)}>
        {shouldRenderSearchInput() && renderSearchInput()}
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
  isSearchable: true,
  isBulkActionsEnabled: true,
  rootNodeActions: [],
  loadMoreData: () => {},
  maxNestingLevel: -1,
  childrenKey: 'children',
  labelKey: 'label',
  idKey: 'key',
  selfControlled: true,
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
  /** The key value of the parent node's total leaves property, relevant when tree is controlled from outside. */
  totalLeavesKey: propTypes.string,
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
  /** If true, search is controlled by the table component. Default is true.*/
  selfControlled: propTypes.bool,
  /** Whether the tree roots can have the same child node without causing unique key conflicts.  */
  isChildrenUniqueKeysOverlap: propTypes.bool,
  /** If there is no need to make changes with selected/added nodes, set this prop to true
   * in order to get the new selectedKeys structure.  */
  isReturnSelectedKeysWhenOnSelect: propTypes.bool,
  /** By default, onSelect returns a list of ids (keys), if isReturnWholeNodeDataWhenOnSelect is set to true,
   * the whole node data will be returned. isReturnSelectedKeysWhenOnSelect won't work when returning whole object data.  */
  isReturnWholeNodeDataWhenOnSelect: propTypes.bool,
}

export default Tree
