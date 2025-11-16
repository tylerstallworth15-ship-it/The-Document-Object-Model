

let posts = [];
let editingPostId = null;

const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('post-title');
const contentInput= document.getElementById('post-content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

function loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('blogPosts');

    if (storedPosts) {
        try {
            posts = JSON.parse(storedPosts);
        } catch (error) {
            console.error('Error parsing posts LocalStorage', error);
            posts = [];
        }
    } else {
        posts = [];
    }
}

function savePostsToLocalStorage() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function generatePostId() {
    return Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function clearErrors() {
    titleError.textContent = '';
    contentError.textContent = '';
}

function resetForm() {
    postForm.reset();
    clearErrors();
    editingPostId = null;
    submitBtn.textContent = 'Add Post';
    cancelEditBtn.style.display = 'none';
}

function renderPosts() {
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet. Start by adding a new one above!</p>';
        return;
    }

    posts.forEach(function (post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.setAttribute('data-id', post.id);

        const titleEl = document.createElement('h3');
        titleEl.classList.add('post-title');
        titleEl.textContent = post.title;

        const contentEl = document.createElement('p');
        contentEl.classList.add('post-content');
        contentEl.textContent = post.content;

        const metaEl = document.createElement('div');
        metaEl.classList.add('post-meta');
        metaEl.textContent = 'Created: ' + formatTimestamp(post.timestamp);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('post-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.setAttribute('data-id', post.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.setAttribute('data-id', post.id);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        postDiv.appendChild(titleEl);
        postDiv.appendChild(metaEl);
        postDiv.appendChild(contentEl);
        postDiv.appendChild(actionsDiv);

        postsContainer.appendChild(postDiv);
      });
}

function validateForm() {
    let isValid = true;
    clearErrors();

    const titleValue = titleInput.value.trim();
    const contentValue = contentInput.value.trim();

    if (titleValue === '') {
        titleError.textContent = 'Please enter a title for your post.';
        isValid = false;
    }

    if (contentValue === '') {
        contentError.textContent = 'Content cannot be empty.';
        isValid = false;
    }

    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();
    console.log("handleFormSubmit");

    if (!validateForm()) {
        return;
    
    }

    const titleValue = titleInput.value.trim();
    const contentValue = contentInput.value.trim();

    if (editingPostId) {

        const postIndex = posts.findIndex(function (p) {
            return p.id === editingPostId;
        });

        if (postIndex !== -1) {
            posts[postIndex].title = titleValue;
            posts[postIndex].content = contentValue;
        }

        savePostsToLocalStorage();
        renderPosts();
        resetForm();
    } else {

        const newPost = {
            id: generatePostId(),
            title: titleValue,
            content: contentValue,
            timestamp: Date.now()
        };

        posts.push(newPost);
        savePostsToLocalStorage();
        renderPosts();
        resetForm();
    }
}

    function handlePostsContainerClick(event) {
        const target = event.target;
    

        if (target.classList.contains('delete-btn')) {
            const postId = target.getAttribute('data-id');
            deletePost(postId);
        }

        if (target.classList.contains('edit-btn')) {
        const postId = target.getAttribute('data-id');
        startEditingPost(postId);
        }
}


function deletePost(postId) {
    posts = posts.filter(function (post) {
        return post.id !== postId;
    });

    savePostsToLocalStorage();
    renderPosts();
}

function startEditingPost(postId) {
    const postToEdit = posts.find(function (post) {
        return post.id == postId;
    });

    if (!postToEdit) return;

    editingPostId = postToEdit.id;

    titleInput.value = postToEdit.title;
    contentInput.value = postToEdit.content;

    submitBtn.textContent = 'Update Post';
    cancelEditBtn.style.display = 'inline-block';

    clearErrors();
}


function handleCancelEdit() {
    resetForm();
}

document.addEventListener('DOMContentLoaded', function () {
    loadPostsFromLocalStorage();
    renderPosts();
});

postForm.addEventListener('submit', handleFormSubmit);
postsContainer.addEventListener('click', handlePostsContainerClick);
cancelEditBtn.addEventListener('click', handleCancelEdit);
