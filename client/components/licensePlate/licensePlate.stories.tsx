import { ComponentMeta } from '@storybook/react'
import LicensePlate from '.'

export default {
	title: 'LicensePlate',
	component: LicensePlate
} as ComponentMeta<typeof LicensePlate>

const Template = (args: any) => <LicensePlate {...args}/>

export const Default = Template.bind({})