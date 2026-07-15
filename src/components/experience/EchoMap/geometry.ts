export type RectSnapshot = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export type MorphGeometry = Readonly<{
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
}>;

/** Postcondition: the snapshot has finite coordinates and dimensions of at least one pixel. */
export function snapshotRect(rect: Pick<DOMRectReadOnly, "height" | "left" | "top" | "width">) {
  return {
    left: Number.isFinite(rect.left) ? rect.left : 0,
    top: Number.isFinite(rect.top) ? rect.top : 0,
    width: Number.isFinite(rect.width) ? Math.max(1, rect.width) : 1,
    height: Number.isFinite(rect.height) ? Math.max(1, rect.height) : 1,
  } satisfies RectSnapshot;
}

function boundedScale(value: number) {
  return Math.max(0.035, Math.min(1, value));
}

/**
 * Calculates the FLIP transform that places `target` over the launcher's live rectangle.
 * Preconditions: both rectangles are viewport-relative and use positive dimensions.
 */
export function morphGeometry(source: RectSnapshot, target: RectSnapshot): MorphGeometry {
  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const targetCenterX = target.left + target.width / 2;
  const targetCenterY = target.top + target.height / 2;

  return {
    translateX: sourceCenterX - targetCenterX,
    translateY: sourceCenterY - targetCenterY,
    scaleX: boundedScale(source.width / Math.max(1, target.width)),
    scaleY: boundedScale(source.height / Math.max(1, target.height)),
  };
}
