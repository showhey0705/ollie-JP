document.addEventListener("DOMContentLoaded", function () {
    const blocks = document.querySelectorAll("[data-animation]");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute("data-delay") || "0s";
                setTimeout(() => {
                    entry.target.classList.add("is-visible");
                }, parseFloat(delay) * 1000); // 秒をミリ秒に変換
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    blocks.forEach((block) => {
        observer.observe(block);
    });
});
