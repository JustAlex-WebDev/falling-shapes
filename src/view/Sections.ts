export class Sections {
  private readonly sections: HTMLDetailsElement[];

  constructor() {
    this.sections = Array.from(document.querySelectorAll<HTMLDetailsElement>("details.section"));

    for (const section of this.sections) {
      section.addEventListener("toggle", () => {
        if (section.open) this.onOpen(section);
      });
    }

    // Sections are always closed when the page loads. Clicking a link like
    // "#decisions" opens that section before the browser scrolls to it.
    document.addEventListener("click", (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (link) this.open(link.hash);
    });
  }

  // Accordion: only one section open at a time. The shared name="about" on the
  // <details> elements already does this in new browsers; this covers older ones.
  private onOpen(opened: HTMLDetailsElement): void {
    for (const section of this.sections) {
      if (section !== opened) section.open = false;
    }

    // If a long section above just closed, the page moves up and the one you
    // opened can end up hidden under the sticky header. Bring it back into view.
    const headerHeight = 60;
    if (opened.getBoundingClientRect().top < headerHeight) {
      opened.scrollIntoView({ block: "start" });
    }
  }

  private open(hash: string): void {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  }
}
