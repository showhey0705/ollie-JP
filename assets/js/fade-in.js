document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.fade-section'); // 各セクションを取得

    sections.forEach(section => {
        const elements = section.querySelectorAll('.fade-in'); // セクション内の fade-in を取得

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    elements.forEach((el, index) => {
                        el.style.transitionDelay = `${index * .24}s`; // 0.2秒ずつズレる
                        el.classList.add('visible');
                    });
                }
            });
        }, { threshold: 0.79 }); // 50% が表示されたら発火

        observer.observe(section); // セクションを監視
    });
});
