function setRandomEmoji() {
    const emojis = [
        '✨', // Sparkles
        '❤️',  // Heart
        '☕',  // Coffee
        '🍵', // Tea
        '💻', // Laptop
        '🛠️', // Tools
        '🎨', // Palette
        '💡', // Light Bulb - Inspiration and ideas
        '📚', // Books - Learning and knowledge
        '🎧', // Headphones - Music or focus while working
        '🌱', // Seedling - Growth and development
        '🔧', // Wrench - Building and fixing
        '🚀', // Rocket - Innovation and launching new ideas
        '🍀', // Four Leaf Clover - Good luck
        '🎈', // Balloon - Celebration and fun
        '🖌️', // Paintbrush - Artistic touch
        '🎉', // Party Popper - Celebration of achievements
        '💎', // Gem Stone - Something valuable and refined
        '🎮', // Video Game - Fun and interactive
        '🔮', // Crystal Ball - Wisdom and knowledge
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    document.getElementById('emoji').textContent = randomEmoji;
}

// Call setRandomEmoji when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setRandomEmoji();
});