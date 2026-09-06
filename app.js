const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!menuButton || !navLinks) {
    return;
  }

  menuButton.classList.remove("open");
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!menuButton || !navLinks) {
    return;
  }

  const isOpen = navLinks.classList.toggle("open");

  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

if (menuButton) {
  menuButton.addEventListener("click", toggleMenu);
}

document.querySelectorAll("[data-scroll]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.dataset.scroll;
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

const sections = document.querySelectorAll("main .section");
const navItems = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navItems.forEach((item) => {
          item.classList.toggle(
            "active",
            item.dataset.scroll === entry.target.id
          );
        });
      });
    },
    {
      threshold: 0.55
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

let scrollFrame;

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        maxScroll > 0
          ? scrollPosition / maxScroll
          : 0;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        progress.toFixed(3)
      );

      document.documentElement.style.setProperty(
        "--side-scroll",
        `${(scrollPosition % 360) * -0.18}px`
      );

      scrollFrame = null;
    });
  },
  {
    passive: true
  }
);