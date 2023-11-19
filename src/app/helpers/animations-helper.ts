export interface PanelTemplateParams {
	right: number;
	left: number;
	top: number;
	midLeft: number;
	position: string;
}

export class AnimationHelper {
	public static getPanelTemplateParams(
		isWidthOver: boolean
	): PanelTemplateParams {
		return isWidthOver
			? { right: 5, left: 60, midLeft: 40, top: 0, position: 'absolute' }
			: { right: 0, left: 0, midLeft: 10, top: 100, position: 'relative' };
	}
}
