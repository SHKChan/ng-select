import { Injectable } from '@angular/core';
export interface ItemsRangeResult {
	scrollHeight: number;
	topPadding: number;
	start: number;
	end: number;
}

export interface PanelDimensions {
	itemHeight: number;
	panelHeight: number;
	itemsPerViewport: number;
}

@Injectable()
export class NgDropdownPanelService {
	private _dimensions: PanelDimensions = {
		itemHeight: 0,
		panelHeight: 0,
		itemsPerViewport: 0,
	};

	get dimensions() {
		return this._dimensions;
	}

	calculateItems(scrollPos: number, itemsLength: number, buffer: number): ItemsRangeResult {
		const d = this._dimensions;
		const scrollHeight = d.itemHeight * itemsLength;

		const scrollTop = Math.max(0, scrollPos);
		const indexByScrollTop = (scrollTop / scrollHeight) * itemsLength;
		let end = Math.min(itemsLength, Math.ceil(indexByScrollTop) + (d.itemsPerViewport + 1));

		const maxStartEnd = end;
		const maxStart = Math.max(0, maxStartEnd - d.itemsPerViewport);
		let start = Math.min(maxStart, Math.floor(indexByScrollTop));
		// Top Padding: used to create the illusion of a full list, actually are "virtualized" (but not rendered)
		// - d.itemHeight * Math.ceil(start): the total height of all items from index 0 to the items before the first visible one
		// - d.itemHeight * Math.min(start, buffer): the height of a small number of items before the first visible item (based on the buffer, actually rendered items)
		let topPadding = d.itemHeight * Math.ceil(start) - d.itemHeight * Math.min(start, buffer);
		topPadding = !isNaN(topPadding) ? topPadding : 0;
		start = !isNaN(start) ? start : -1;
		end = !isNaN(end) ? end : -1;
		start -= buffer;
		start = Math.max(0, start);
		end += buffer;
		end = Math.min(itemsLength, end);

		return {
			topPadding, // amount of padding required above the rendered items to maintain correct positioning
			scrollHeight, // total height of the content area, which is used to calculate the scrollable area
			start, // the index of the first item to be rendered(include buffer)
			end, // the index of the last item to be rendered(include buffer)
		};
	}

	setDimensions(itemHeight: number, panelHeight: number) {
		const itemsPerViewport = Math.max(1, Math.floor(panelHeight / itemHeight));
		this._dimensions = {
			itemHeight,
			panelHeight,
			itemsPerViewport,
		};
	}

	getScrollTo(itemTop: number, itemHeight: number, lastScroll: number) {
		const { panelHeight } = this.dimensions;
		const itemBottom = itemTop + itemHeight;
		const top = lastScroll;
		const bottom = top + panelHeight;

		if (panelHeight >= itemBottom && lastScroll === itemTop) {
			return null;
		}

		if (itemBottom > bottom) {
			return top + itemBottom - bottom;
		} else if (itemTop <= top) {
			return itemTop;
		}

		return null;
	}
}
