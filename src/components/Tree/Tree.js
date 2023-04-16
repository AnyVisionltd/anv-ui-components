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
  PARENT_NODE_WRAPPER_HEIGHT,
  PARENT_NODE_HEIGHT,
  LEAF_NODE_HEIGHT,
  refreshTree,
  getDataAfterReGroup,
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
      isBulkSelect,
      isBulkExpand,
      onSearch,
      placeholder,
      onExpand,
      onLoadNewChildren,
      onSelect,
      renderParent,
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
      totalChildrenKey,
      hasMoreChildrenKey,
      isLoading,
      isChildrenUniqueKeysOverlap,
      isReturnSelectedKeysWhenOnSelect,
      isReturnWholeNodeDataWhenOnSelect,
      selfControlled,
      totalRootNodes,
      rootNodeHeight,
      parentNodeHeight,
      leafNodeHeight,
      initialSelectionData,
      isCalculateSelectionAndAmountOfDirectChildren,
      isCalculateExcludeModeOfParentNode,
      onDragItem,
      qaTree='',
      qaNodesRoot='',
      qaNodesLeafs=''
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
    const keyValues = {
      childrenKey,
      labelKey,
      idKey,
      totalLeavesKey,
      hasMoreChildrenKey,
      totalChildrenKey,
    }
    const nodeHeightsValues = {
      rootNodeHeight,
      parentNodeHeight,
      leafNodeHeight,
    }

    const {
      searchQuery,
      handleSearch,
      filteredData,
      resetSearchData,
      handleAddNewNodes,
      handleSetNodeNewProperties,
      handleSetNewNodes,
      handleAddNewNestedNodes,
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
      isSelectionUpdatedAfterMount,
      flattenTreeData,
      handleIsNodeSelectedWithExclusion,
      handleOnSelectWithExclusion,
      handleIsAllNodesAreSelectedWithExclusion,
      getParentNodeExcludeMode,
    } = useFlattenTreeData({
      data: nodes,
      selectedKeys,
      maxNestingLevel,
      isChildrenUniqueKeysOverlap,
      selfControlled,
      totalRootNodes,
      initialSelectionData,
      isCalculateSelectionAndAmountOfDirectChildren,
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
        scrollToItem: nodeKey => treeInstance?.scrollToItem(nodeKey),
        expandCollapseItems: (nodeKeys, isExpand = true) =>
          treeInstance?.recomputeTree(
            nodeKeys.reduce((acc, id) => ({ ...acc, [id]: isExpand }), {}),
          ),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [flattenedNodes, treeInstance],
    )

    const {
      totalChildren: totalChildrenInTree,
      totalSelected: totalSelectedInTree,
    } = calculateTotalSelectedAndChildrenOfAllNodes()
    const areAllNodesSelected = selfControlled
      ? totalChildrenInTree === totalSelectedInTree
      : handleIsAllNodesAreSelectedWithExclusion()

    const handleLoadChildrenToParentNode = async nodeKey => {
      const node = flattenedNodes[nodeKey]
      const childrenAmount = node[childrenKey].length
      const { newChildren, [hasMoreChildrenKey]: hasMoreChildren } =
        (await onLoadNewChildren?.({
          id: nodeKey,
          offset: childrenAmount,
        })) || {}
      if (!newChildren?.length) return

      const childrenDataWithProperties = handleAddNewNestedNodes({
        parentNodeKey: nodeKey,
        newNodes: newChildren,
        nodesMap: flattenedNodes,
        indexPropertyIncrementOfChildren: childrenAmount,
        newParentNodeProperties: {
          [hasMoreChildrenKey]: hasMoreChildren,
        },
      })
      const updatedParentNode = {
        ...node,
        [hasMoreChildrenKey]: hasMoreChildren,
        [childrenKey]: [
          ...node[childrenKey],
          ...childrenDataWithProperties.map(({ uniqueKey }) => ({ uniqueKey })),
        ],
      }
      handleAddNewFlattenedNodes({
        newNodesData: childrenDataWithProperties,
        layer: node.layer + 1,
        updatedParentNode,
      })
      updateAmountOfSelectedNodesAndChildren(nodeKey)
      if (childrenAmount) {
        refreshTree(treeInstance)
      }
    }

    const handleOnSelectWithExclusionMode = ({ nodeKey, node, isSelected }) => {
      const newSelectionData = handleOnSelectWithExclusion({
        nodeKey,
        isSelected,
        node,
      })
      updateAmountOfSelectedNodesAndChildren(nodeKey)
      onSelect({
        selectionData: newSelectionData,
        clickedNode: {
          id: nodeKey,
          node,
          isSelected,
        },
      })
    }

    const handleOnSelect = (node, isCurrentlySelected) => {
      const nodeKey = Array.isArray(node)
        ? ALL_ROOTS_COMBINED_KEY
        : node.uniqueKey
      if (!selfControlled) {
        handleOnSelectWithExclusionMode({
          nodeKey,
          node,
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
        handleSetNewNodes(nodes)
        flattenTreeData(nodes, selectedKeys)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, selfControlled, isLoading])

    useEffect(() => {
      if (selfControlled && filteredData.length < nodes.length) {
        const newAddedNodes = nodes.slice(filteredData.length)
        handleAddNewNodes(newAddedNodes)
        handleAddNewFlattenedNodes({ newNodesData: newAddedNodes })
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
        isSelectionUpdatedAfterMount.current
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
        treeInstance.state.recomputeTree(allExpandedCollapsedNodesObj)
        setAreAllNodesExpanded(!areAllNodesExpanded)
      }
    }

    const handleLoadMoreData = useCallback(async () => {
      const newNodes = await loadMoreData()
      if (!newNodes) return
      handleAddNewNodes(newNodes)
      handleAddNewFlattenedNodes({ newNodesData: newNodes })
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
        disabled={isLoading}
        data-testid={'search-' + qaTree + '-input'}
      />
    )

    const renderBulkActions = () => (
      <div className={styles.bulkActions}>
        {isBulkSelect && (
          <div className={styles.bulkSelectContainer}>
            <Checkbox
              checked={areAllNodesSelected}
              onChange={() => handleOnSelect(filteredData, areAllNodesSelected)}
              className={styles.checkbox}
              id='bulk-select-tree'
              qa={qaTree + '-bulk-selection'}
            />
            <label
              htmlFor='bulk-select-tree'
              className={styles.bulkSelectLabel}
            >
              {areAllNodesSelected
                ? TreeTranslations.selectNone
                : TreeTranslations.selectAll}
            </label>
          </div>
        )}
        {isBulkExpand && (
          <div className={styles.bulkExpand} data-testid='bulk-expand-button' onClick={handleBulkExpandCollapse}>
            {areAllNodesExpanded
              ? TreeTranslations.collapseAll
              : TreeTranslations.expandAll}
          </div>
        )}
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

    const handleIsParentNodeSelected = (
      uniqueKey,
      totalSelected,
      totalChildren,
    ) => {
      if (selfControlled) {
        return totalSelected === totalChildren
      }
      return handleIsNodeSelectedWithExclusion(uniqueKey)
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
      const {
        isOpen,
        handleExpand,
        style,
        isLoading,
        nodesMap,
      } = virtualizedListProps
      const { renderActions } = rootNodeProps
      const {
        totalSelected = 0,
        totalChildren = children.length,
      } = calculateAmountOfSelectedNodesAndChildren(uniqueKey)
      const isSelected = handleIsParentNodeSelected(
        uniqueKey,
        totalSelected,
        totalChildren,
      )
      const onSelect = () => handleOnSelect(node, isSelected)
      const isExcludeMode = isCalculateExcludeModeOfParentNode
        ? getParentNodeExcludeMode(uniqueKey)
        : undefined

      const infoText = getParentNodeInfo(totalChildren, totalSelected)

      const { containerClasses, wrapperClasses } = getParentNodeClasses(
        nestingLevel,
        isOpen,
      )

      if (renderParent) {
        return renderParent(node, {
          isSelected,
          onSelect,
          totalSelected,
          totalChildren,
          onExpand: handleExpand,
          isOpen,
          isLoading,
          isExcludeMode,
          nodesMap,
        })
      }

      return (
        <div className={containerClasses} key={uniqueKey} data-testid={qaNodesRoot + '-' + label.toLowerCase().split(' ').join('-')}>
          <div className={wrapperClasses}>
            <div style={style} className={styles.parentNode}>
              <Checkbox
                disabled={!totalChildren}
                checked={isSelected}
                onChange={onSelect}
                className={classNames(
                  styles.isSelectedCheckbox,
                  styles.checkbox,
                )}
                qa={qaNodesRoot}
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
                    qa={'expand-' + qaNodesRoot}
                  />
                  <p className={styles.parentInfoText} data-testid={qaNodesRoot + '-info'}>{infoText}</p>
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
      const onSelect = () => handleOnSelect(node, isSelected)

      const { containerClasses, leafNodeClasses } = getLeafNodeClasses(
        isLastLeaf,
      )

      if (renderLeaf) {
        return renderLeaf(node, {
          isSelected,
          isLastLeafOfParent: isLastLeaf,
          onSelect,
        })
      }

      return (
        <div className={containerClasses} key={uniqueKey}>
          <div style={style} className={styles.leafNodeWrapper}>
            <div className={leafNodeClasses} data-testid={label.toLowerCase().split(' ').join('-') + '-' + qaNodesLeafs}>
              <div className={styles.leftSideLeaf}>
                <Checkbox
                  checked={isSelected}
                  onChange={onSelect}
                  className={styles.checkbox}
                  qa={qaNodesLeafs}
                />
                <Tooltip content={label} overflowOnly>
                  <p className={styles.leafLabel} data-testid={qaNodesLeafs + '-name'}>{label}</p>
                </Tooltip>
              </div>
              {renderLeafRightSide && renderLeafRightSide(node)}
            </div>
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
            qa={qaNodesRoot}
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

    function handleDragItem({ dragged, dragTo }) {
      const updatedData = getDataAfterReGroup([...nodes], dragged, dragTo)
      onDragItem({ updatedData, dragged, dragTo })
      refreshTree(treeInstance)
    }

    const renderVirtualizedTreeList = () => (
      <VirtualizedTreeList
        setTreeInstance={setTreeInstance}
        rootNodes={filteredData}
        renderNode={renderNode}
        loadMoreData={handleLoadMoreData}
        isSearching={!!searchQuery.length}
        nodesMap={flattenedNodes}
        onExpand={onExpand}
        nodeHeightsValues={nodeHeightsValues}
        selfControlled={selfControlled}
        handleLoadChildrenToParentNode={handleLoadChildrenToParentNode}
        onDragItem={handleDragItem}
        isDraggable={!!onDragItem}
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

    const isBulkActionsEnabled = isBulkSelect | isBulkExpand

    return (
      <div className={classNames(styles.tree, className)}>
        <div className={styles.header}>
          {isSearchable && renderSearchInput()}
          {!!isBulkActionsEnabled && !isEmpty && renderBulkActions()}
        </div>
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
  isSearchable: true,
  isBulkSelect: true,
  isBulkExpand: true,
  rootNodeActions: [],
  loadMoreData: () => {},
  maxNestingLevel: -1,
  childrenKey: 'children',
  labelKey: 'label',
  idKey: 'key',
  selfControlled: true,
  rootNodeHeight: PARENT_NODE_WRAPPER_HEIGHT,
  parentNodeHeight: PARENT_NODE_HEIGHT,
  leafNodeHeight: LEAF_NODE_HEIGHT,
  isCalculateSelectionAndAmountOfDirectChildren: true,
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
  /** The key value of the parent node's total leaves = (direct children who are not parents) property, relevant when tree is controlled from outside. */
  totalLeavesKey: propTypes.string,
  /** The key value of the parent node's total children property (both leaves and parents), relevant when tree is controlled from outside. */
  totalChildrenKey: propTypes.string,
  /** The key value of the parent node's property to know whether there are more children to the node in the backend, relevant when tree is controlled from outside. */
  hasMoreChildrenKey: propTypes.string,
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
  /** Enable bulk selection functionality. */
  isBulkSelect: propTypes.bool,
  /** Enable bulk expand functionality. */
  isBulkExpand: propTypes.bool,
  /** Called when a tree parent node is expanded. */
  onExpand: propTypes.func,
  /** Called when dragging an item to another. By default the tree is not draggable. */
  onDragItem: propTypes.func,
  /** Callback function after selecting / unselecteing tree node or nodes. */
  onSelect: propTypes.func,
  /** Callback for adding new children to a new nested node, called when node is expanded or "load more" button is clicked. */
  onLoadNewChildren: propTypes.func,
  /** Custom render for the whole leaf node row. */
  renderLeaf: propTypes.func,
  /** Custom render for the right side of leaf node. */
  renderLeafRightSide: propTypes.func,
  /** Custom render for the whole parent node row. */
  renderParent: propTypes.func,
  /** Height of a root node (parent node in the first layer). Default is 80. */
  rootNodeHeight: propTypes.number,
  /** Height of a root node. Default is 72. */
  parentNodeHeight: propTypes.number,
  /** Height of a root node. Default is 48. */
  leafNodeHeight: propTypes.number,
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
  /** Whether to calulate the amount of the direct children of node or not.
   * If set to false, each node's totalChildren/ totalSelected will be set to the total descendents of a node (not only direct children).
   * By default it is set to true. Relevant only when tree is not selfControlled. */
  isCalculateSelectionAndAmountOfDirectChildren: propTypes.bool,
  /** Whether to calulate the exclusion mode of a parent node (true/false). Relevant only when tree is not selfControlled. */
  isCalculateExcludeModeOfParentNode: propTypes.bool,
  /** The default initial selection of the tree when selfControlled is set to false. Prop is optional. */
  initialSelectionData: propTypes.object,
}

export default Tree
