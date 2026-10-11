(() => {
  const isDesktop = () =>
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

  // Block desktop right-click.
  document.addEventListener('contextmenu', (e) => {
    if (isDesktop()) e.preventDefault();
  }, true);

  // Restrict common developer shortcuts.
  document.addEventListener('keydown', (e) => {
    if (!isDesktop()) return;

    const key = e.key.toLowerCase();

    const blocked =
      key === 'f12' ||
      (
        e.ctrlKey &&
        e.shiftKey &&
        ['i', 'j', 'c', 'k'].includes(key)
      ) ||
      (
        e.metaKey &&
        e.altKey &&
        ['i', 'j', 'c', 'u'].includes(key)
      ) ||
      (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        !e.altKey &&
        key === 'u'
      );

    if (blocked) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
