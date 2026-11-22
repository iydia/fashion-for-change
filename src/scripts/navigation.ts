const nav = document.getElementById('primary-navigation');
const navList = document.getElementById('primary-nav-list');
const toggle = document.getElementById('nav-toggle');

if (nav && navList && toggle) {
    const groups = Array.from(nav.querySelectorAll<HTMLLIElement>('.nav-group'));
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let openGroup: HTMLLIElement | null = null;
    let openedByHover = false;

    const getTrigger = (group: HTMLLIElement) => group.querySelector<HTMLButtonElement>('.nav-trigger');
    const getPanel = (group: HTMLLIElement) => group.querySelector<HTMLUListElement>('.nav-panel');

    function openDropdown(group: HTMLLIElement, viaHover = false) {
        if (openGroup && openGroup !== group) closeDropdown(openGroup);
        const trigger = getTrigger(group);
        const panel = getPanel(group);
        if (!trigger || !panel) return;
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        openGroup = group;
        openedByHover = viaHover;
    }

    function closeDropdown(group: HTMLLIElement) {
        const trigger = getTrigger(group);
        const panel = getPanel(group);
        if (!trigger || !panel) return;
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (openGroup === group) {
            openGroup = null;
            openedByHover = false;
        }
    }

    function closeAllDropdowns() {
        groups.forEach(closeDropdown);
    }

    function closeMobileNav() {
        navList?.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
    }

    groups.forEach((group) => {
        const trigger = getTrigger(group);
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            if (openGroup === group) {
                // A mouse click always fires a preceding mouseenter. If hover just opened
                // this panel, let the click confirm that state instead of closing it again.
                if (openedByHover) {
                    openedByHover = false;
                } else {
                    closeDropdown(group);
                }
            } else {
                openDropdown(group);
            }
        });

        if (canHover) {
            group.addEventListener('mouseenter', () => openDropdown(group, true));
            group.addEventListener('mouseleave', () => {
                if (document.activeElement instanceof Node && group.contains(document.activeElement)) return;
                closeDropdown(group);
            });
        }
    });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node)) return;
        if (!nav.contains(event.target)) closeAllDropdowns();
    });

    nav.addEventListener('focusout', (event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && nav.contains(next)) return;
        closeAllDropdowns();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        if (openGroup) {
            const trigger = getTrigger(openGroup);
            closeDropdown(openGroup);
            trigger?.focus();
            return;
        }

        if (navList.classList.contains('is-open')) {
            closeMobileNav();
            toggle.focus();
        }
    });

    toggle.addEventListener('click', () => {
        if (navList.classList.contains('is-open')) {
            const hadFocusInside = document.activeElement instanceof Node && navList.contains(document.activeElement);
            closeMobileNav();
            if (hadFocusInside) toggle.focus();
        } else {
            navList.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
        }
    });

    navList.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;
        if (event.target.closest('a')) closeMobileNav();
    });
}
