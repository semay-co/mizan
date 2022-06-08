import Button from '.'
import { ComponentMeta } from '@storybook/react'

export default {
	title: 'Button',
	component: Button
} as ComponentMeta<typeof Button>

const Template = (args: any) => <Button {...args}/>

export const Default = Template.bind({})