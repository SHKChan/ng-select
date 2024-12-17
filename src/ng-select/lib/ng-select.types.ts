export interface NgOption {
	[name: string]: any;

	index?: number;
	htmlId?: string;
	// Option State
	selected?: boolean;
	disabled?: boolean;
	marked?: boolean;
	// Binding
	label?: string;
	value?: string | any;
	// Group
	parent?: NgOption;
	children?: NgOption[];
}

export enum KeyCode {
	Tab = 9,
	Enter = 13,
	Esc = 27,
	Space = 32,
	ArrowUp = 38,
	ArrowDown = 40,
	Backspace = 8,
}

export type DropdownPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';
