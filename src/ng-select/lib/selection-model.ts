import { NgOption } from './ng-select.types';

export type SelectionModelFactory = () => SelectionModel;

export function DefaultSelectionModelFactory() {
	return new DefaultSelectionModel();
}

export interface SelectionModel {
	value: NgOption[];
	select(item: NgOption, multiple: boolean, selectableGroupAsModel: boolean);
	unselect(item: NgOption, multiple: boolean);
	clear(keepDisabled: boolean);
}

export class DefaultSelectionModel implements SelectionModel {
	private _selected: NgOption[] = [];

	get value(): NgOption[] {
		return this._selected;
	}

	select(item: NgOption, multiple: boolean, groupAsModel: boolean) {
		// Set passing item as selected
		item.selected = true;
		// Push selected item into selected array：
		// 1.Item without children
		// 2. Single select with group as model
		if (!item.children || (!multiple && groupAsModel)) {
			this._selected.push(item);
		}
		if (multiple) {
			// If parent item should be set as selected
			if (item.parent) {
				const childrenCount = item.parent.children.length;
				const selectedCount = item.parent.children.filter((x) => x.selected).length;
				item.parent.selected = childrenCount === selectedCount;
				// If passing item has children
			} else if (item.children) {
				// Set all active children as selected
				this._setChildrenSelectedState(item.children, true);
				// Remove all active children from selected array
				this._removeChildren(item);
				if (groupAsModel && this._activeChildren(item)) {
					// If group as model is enabled and all children are active
					// Remove all children from selected array
					// Push group as a item into selected array
					this._selected = [...this._selected.filter((x) => x.parent !== item), item];
				} else {
					// Push all active children into selected array
					this._selected = [...this._selected, ...item.children.filter((x) => !x.disabled)];
				}
			}
		}
	}

	unselect(item: NgOption, multiple: boolean) {
		this._selected = this._selected.filter((x) => x !== item);
		item.selected = false;
		if (multiple) {
			if (item.parent && item.parent.selected) {
				const children = item.parent.children;
				this._removeParent(item.parent);
				this._removeChildren(item.parent);
				this._selected.push(...children.filter((x) => x !== item && !x.disabled));
				item.parent.selected = false;
			} else if (item.children) {
				this._setChildrenSelectedState(item.children, false);
				this._removeChildren(item);
			}
		}
	}

	clear(keepDisabled: boolean) {
		this._selected = keepDisabled ? this._selected.filter((x) => x.disabled) : [];
	}

	// Update all active children selected state
	private _setChildrenSelectedState(children: NgOption[], selected: boolean) {
		for (const child of children) {
			if (child.disabled) {
				continue;
			}
			child.selected = selected;
		}
	}

	// Remove all active children(selected as true) from selected array
	private _removeChildren(parent: NgOption) {
		this._selected = [
			...this._selected.filter((x) => x.parent !== parent),
			...parent.children.filter((x) => x.parent === parent && x.disabled && x.selected),
		];
	}

	// Remove passing item from selected array
	private _removeParent(parent: NgOption) {
		this._selected = this._selected.filter((x) => x !== parent);
	}

	// Check if all children are either:
	// 1.Active, OR
	// 2.Selected.
	private _activeChildren(item: NgOption): boolean {
		return item.children.every((x) => !x.disabled || x.selected);
	}
}
