import { shallowMount } from '@vue/test-utils'
import _response from '../../response'

const factory = () => {
  return shallowMount(_response, {})
}

describe('Response detail', () => {
  test('mounts properly', () => {
    const wrapper = factory()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = factory()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
