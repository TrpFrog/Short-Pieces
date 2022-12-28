function randRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

document.addEventListener("DOMContentLoaded", async () => {
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', async () => {
        const canvas = document.createElement('canvas');
        // document.body.appendChild(canvas);
        canvas.width = 1000;
        canvas.height = 1000;
        const context = canvas.getContext('2d');

        context.beginPath();
        context.fillStyle = `hsl(${randRange(0, 360)}, 100%, 90%)`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();

        const bkgImage = new Image();
        await new Promise((resolve) => {
            bkgImage.onload = () => {
                context.drawImage(bkgImage, 0, 0, canvas.width, canvas.height);
                resolve();
            }
            bkgImage.src = './trpfrog-circle.png';
        });

        const image = new Image();
        await new Promise((resolve) => {
            const file = fileInput.files[0];
            image.onload = () => {
                const sz = 230;
                const dx = (canvas.width / 2) - (sz / 2);
                const dy = (canvas.height / 2) - (sz / 2);
                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, sz / 2, (0 * Math.PI) / 180, (360 * Math.PI) / 180) ;
                context.clip() ;
                context.drawImage(image, dx, dy, sz, sz);
                context.closePath();
                resolve();
            };
            image.src = URL.createObjectURL(file);
        });

        document.getElementById("result").src = canvas.toDataURL();

        const tweetText = [
            "My Twitter Interaction Circle",
            "",
            "Generate yours at https://trpfrog.github.io/playground/twittercircle",
            "",
            "⠀",
        ].join('\n');
        const tweetLink = document.getElementById('tweet-button');
        tweetLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        document.getElementById("tweet-area").style.display = "block";

        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    });
})