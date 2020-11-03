import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

import ArticleList from '../ArticleList'
import { article, articleWithoutEmbedded } from '@__mocks__/article'

export const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
    useNavigationParam: jest.fn(jest.requireActual('@react-navigation/native').useNavigationParam),
  }
})

describe('<ArticleList />', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<ArticleList data={[article]} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('has no image and renders a View with three texts instead', () => {
    const { getByTestId } = render(<ArticleList data={[articleWithoutEmbedded]} />)
    expect(getByTestId('no-image').children).toHaveLength(3)
  })

  it('should call the navigate function once', () => {
    const { getByTestId } = render(<ArticleList data={[article]} />)
    fireEvent.press(getByTestId('button'))
    expect(mockedNavigate).toHaveBeenCalledTimes(1)
  })
})
