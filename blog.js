// Blog data structure - is a simple JavaScript object that holds the blog data.
const blogData = {
    faith: {
        title: "Faith in Action",
        posts:[
            {
                content: "Faith is not just a belief; it's a commitment to act on that belief. In this blog, we explore how faith can inspire us to take action in our lives and the lives of others.",
                author: "John Doe",
                date: "2023-10-01"
            },
            {
                content: "Faith can be a powerful motivator. It can push us to overcome obstacles and achieve our goals. In this post, we share stories of individuals who have turned their faith into action.",
                author: "Jane Smith",
                date: "2023-10-02"
            },
            {
                content: "In times of uncertainty, faith can provide us with the strength to persevere. This post discusses how faith can help us navigate through difficult times and emerge stronger.",
                author: "Emily Johnson",
                date: "2023-10-03"
            },
            {
                content: "Faith is not just a personal journey; it can also be a communal experience. In this post, we explore how faith can bring people together and inspire collective action.",
                author: "Michael Brown",
                date: "2023-10-04"
            }

        ]
        
    },
    spiritual: {
        title: "Spiritual Growth",
        posts:[
            {
                content: "Spiritual growth is a lifelong journey. In this blog, we discuss the importance of nurturing our spiritual lives and the practices that can help us grow.",
                author: "Sarah Wilson",
                date: "2023-10-05"
            },
            {
                content: "Meditation and mindfulness are powerful tools for spiritual growth. In this post, we explore different meditation techniques and their benefits.",
                author: "David Lee",
                date: "2023-10-06"

            },
            {
                content: "Nature can be a source of spiritual inspiration. This post discusses how spending time in nature can enhance our spiritual lives and connect us to something greater.",
                author: "Laura Garcia",
                date: "2023-10-07"
            }
        ]
    },
    event: {
        title: "Community Events",
        posts:[
            {
                content: "Town clean-up day is coming up! Join us on October 15th to help beautify our community. Supplies will be provided, and all ages are welcome.",
                date: "2023-10-08",
            },
            {
                content: "Virgil mass will be held on October 20th at 6 PM. Join us for a special evening of prayer and reflection.",
                date: "2023-10-09",
            },
            {
                content: "Easter egg hunt is scheduled for April 1st. Bring your kids for a fun-filled day of egg hunting and activities.",
                date: "2023-10-10",
            }
        ]

    }
};

// Function to dynamically load blog content
// This function is triggered when the "Read More" button is clicked.
document.querySelectorAll('.read-more').forEach(button => { // Select all buttons with the class 'read-more'
    // For each button, add a click event listener
    button.addEventListener('click',function (e) {
        e.preventDefault();

        const type = this.getAttribute('data-type');
        const content = blogData[type]

        if(content) {
            const title = document.querySelector('.blog-title');
            const blogList = document.querySelector('.blog-posts');

            title.innerHTML = content.title;
           blogList.innerHTML = content.posts.map(post => { // Map through the posts array and create HTML for each post
                // Return a string of HTML for each post
                return `
                    <div class="blog-post">
                        <h4>${post.author ? post.author + ' - ' : ''}${post.date}</h4>
                        <p>${post.content}</p>
                    </div>
                `;
            }).join('');

            title.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('.blog-content').scrollIntoView({behavior: 'smooth'});
        }
    })
}
);

// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const closeMenuBtn = document.querySelector('.close-menu-btn');

menuToggle.addEventListener('click', () => {
  navMenu.classList.add('active');
  closeMenuBtn.style.display = 'block';
});

closeMenuBtn.addEventListener('click', () => {
  navMenu.classList.remove('active');
  closeMenuBtn.style.display = 'none';
}); 