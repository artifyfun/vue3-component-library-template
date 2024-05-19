import MyHeader from '../lib/components/Header.vue'

const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Example/Header',
  component: MyHeader,
  render: (args) => ({
    components: { MyHeader },
    setup() {
      return { args }
    },
    template: '<my-header :user="args.user" />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
}

export default meta

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

export const LoggedOut = {
  args: {
    user: null,
  },
}
