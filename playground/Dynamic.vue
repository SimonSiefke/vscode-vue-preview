<template>
  <div>
    <h1>Here are the post titles:</h1>
    <ul>
      <li v-for="post in posts">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // setting the template that this component will use to render
  template: '#static-posts-template',

  // the data function is where we define all the variables this component will need
  // in this specific case, we only need to worry about an array of posts
  data: () => ({
    posts: [],
  }),

  // this is called whenever this component is mounted onto the DOM
  // basically whenever we want to show all the posts, we go and get them
  mounted() {
    this.getPosts()
  },

  // this is where you define all the methods this component needs
  methods: {
    // getPost simply sets the 'posts' variable with static data
    getPosts() {
      this.posts = [
        {
          title: 'The first post',
        },
        {
          title: 'The second post title!',
        },
        {
          title: 'The third post title!',
        },
      ]
    },
  },
}
</script>