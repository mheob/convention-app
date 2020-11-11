import React, { useEffect, useState } from 'react'
import { Dimensions, Linking, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import HTML from 'react-native-render-html'
import { Ionicons } from '@expo/vector-icons'

import LoadingSpinner from '@components/UI/LoadingSpinner'
import Text from '@components/UI/Text'
import { HomeStackParamList } from '@navigations/HomeNavigator'
import { CategoriesStackParamList } from '@navigations/CategoriesNavigator'
import { fetchPost } from '@utils/api'
import { getLocaleLongDate } from '@utils/date-time'
import { Article } from '@models/article'
import { colors, DefaultStyles, defaultStyles, fonts, htmlBodyTagStyles } from '@styles/theme'

const ArticleScreen: React.FC = () => {
  const route = useRoute<RouteProp<HomeStackParamList | CategoriesStackParamList, 'ArticleScreen'>>()

  const [isLoading, setLoading] = useState(true)
  const [article, setArticle] = useState<Article | undefined>(undefined)

  useEffect(() => {
    const getArticlesAsync = async () => {
      try {
        const articleResponse = await fetchPost(route.params.postId)
        setArticle(await articleResponse.json())
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getArticlesAsync()
  }, [])

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.categoriesContainer}>
            {article?.categories_names.map(category => (
              <Text key={category} style={styles.category}>
                {category}
              </Text>
            ))}
          </View>
          <View style={styles.titleContainer}>
            <HTML baseFontStyle={styles.title} html={`${article?.title.rendered}`} />
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="ios-clock" size={12} color={colors.accentColor} />
            <Text style={styles.date}>{getLocaleLongDate(new Date(article?.date_gmt || Date.now.toString()))}</Text>
          </View>
          <HTML baseFontStyle={styles.teaser} html={`${article?.excerpt.rendered}`} />
          <HTML
            baseFontStyle={styles.text}
            tagsStyles={htmlBodyTagStyles}
            html={`${article?.content.rendered}`}
            ignoredStyles={['height', 'width']}
            imagesMaxWidth={Dimensions.get('window').width - 30}
            onLinkPress={(_, href) => Linking.openURL(href)}
          />
        </ScrollView>
      )}
    </React.Fragment>
  )
}

interface Styles extends DefaultStyles {
  categoriesContainer: ViewStyle
  category: TextStyle
  titleContainer: ViewStyle
  teaser: TextStyle
}

const styles = StyleSheet.create<Styles>({
  ...defaultStyles,
  container: {
    ...defaultStyles.container,
    padding: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  category: {
    ...defaultStyles.title,
    fontSize: 10,
    marginTop: 5,
    paddingRight: 5,
  },
  titleContainer: {
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.serifBold,
    lineHeight: 32,
    paddingTop: 10,
  },
  teaser: {
    color: colors.accentColor,
    fontSize: 18,
  },
})

export default ArticleScreen
