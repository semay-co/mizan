import DotMatrix from '.'
import { ComponentMeta } from '@storybook/react'

export default {
	title: 'DotMatrix',
	component: DotMatrix
} as ComponentMeta<typeof DotMatrix>

const Template = (args: any) => <DotMatrix {...args}/>

export const Default = Template.bind({})