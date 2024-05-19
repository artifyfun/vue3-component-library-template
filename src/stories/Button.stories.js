import Button from '../lib/components/Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Example/Button',
  component: Button,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
  },
  args: { primary: false }, // default value
}

export default meta
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
}

export const Secondary = {
  args: {
    primary: false,
    label: 'Button',
  },
}

export const Large = {
  args: {
    label: 'Button',
    size: 'large',
  },
}

export const Small = {
  args: {
    label: 'Button',
    size: 'small',
  },
}
