import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function prettyDate(date: Date) {
	return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${date.getDate()}. ${date.getFullYear()}`;
}

export function prettySize(bytes: number) {
	const thresh = 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let u = -1;
	const r = 10**1;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


	return bytes.toFixed(1) + ' ' + units[u];
}

export type FileInfo = ({
    type: "file"
    name: string
    size: number
    lastModified: Date
    extension: string
} | {
    type: "folder"
    name: string
    size: number
    lastModified: Date
    children: {[key: string]: FileInfo}
    extension: "folder"
})

export function getValue(obj: { [key: string]: FileInfo }, keyString: string) {
	const keys = keyString.split('/').slice(2, -1);
	let current = obj;
  
	for (const key of keys) {
	  if (current && current.hasOwnProperty(key) && current[key].type === "folder") {
		current = current[key].children;
	  } else {
		return undefined;
	  }
	}
	return current;
  }