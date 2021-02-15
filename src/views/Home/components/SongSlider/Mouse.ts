/**
 * Mouse class
 */
export class Mouse {
  /**
   * Mouse's X-coordinates
   */
  public x = 0;

  private xOrigin = 0;

  /**
   * Mouse's Y-coordinates
   */
  public y = 0;

  private yOrigin = 0;

  /**
   * Update the mouse's position after triggering event
   * @param event Mouse event
   */
  updatePosition(divRef: HTMLElement, event: MouseEvent): string {
    const viewportOffset = divRef.getBoundingClientRect();
    this.xOrigin = viewportOffset.left + Math.floor(divRef.offsetWidth / 2);
    this.yOrigin = viewportOffset.top + Math.floor(divRef.offsetHeight / 2);

    this.x = event.clientX - this.xOrigin;
    this.y = (event.clientY - this.yOrigin) * -1;

    return this.show();
  }

  /**
   * Show the mouse's coordinates in formatted string
   */
  show(x = this.x, y = this.y): string {
    return `(${x}, ${y})`;
  }
}

export default Mouse;
