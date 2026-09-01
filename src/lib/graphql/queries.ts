import { gql } from '@apollo/client';

export const GET_ALL_ANIMES_LIGHT = gql`
  query GetAllAnimesLight($genre: String, $search: String, $studio: String, $year: Int) {
    animes(genre: $genre, search: $search, studio: $studio, year: $year) {
      id
      slug
      title
      titleJapanese
      romaji
      posterUrl
      bannerUrl
      year
      season
      studio
      episodes
      status
      score
      rank
      genres
      tags
      shortSynopsis
      timelineEventCount
      characterCount
    }
  }
`;

export const GET_ANIME_BY_SLUG_HEAVY = gql`
  query GetAnimeBySlugHeavy($slug: String!) {
    anime(slug: $slug) {
      id
      slug
      title
      titleJapanese
      romaji
      posterUrl
      bannerUrl
      year
      season
      studio
      episodes
      status
      score
      rank
      genres
      tags
      shortSynopsis
      fullSynopsis
      inUniverseTimelineSpan
      canonPercentage
      timelineBranches
      timelineEventCount
      characterCount
      arcs {
        id
        title
        episodes
        season
        description
        color
        canonType
        startYearInUniverse
        endYearInUniverse
        eventCount
      }
      events {
        id
        title
        arcId
        arcName
        episodeStart
        episodeEnd
        type
        canonType
        dateInUniverse
        summary
        impactScore
        keyCharacters
        consequences
        quote
        quoteSpeaker
        mediaUrl
        tags
        branchId
        position {
          x
          y
        }
      }
      edges {
        id
        source
        target
        label
        type
        animated
      }
      characters {
        id
        name
        japaneseName
        role
        factionId
        factionName
        avatarUrl
        coverUrl
        status
        powerLevel
        abilities
        summary
        quote
        voiceActor
        firstAppearanceEpisode
        affiliations
      }
      factions {
        id
        name
        japaneseName
        leader
        color
        badgeBg
        description
        moralAlignment
        memberCount
      }
      relationships {
        id
        source
        target
        type
        label
        description
        strength
      }
      crossConnections {
        id
        targetAnimeSlug
        targetAnimeTitle
        targetPosterUrl
        connectionType
        title
        description
        sharedElements
      }
    }
  }
`;
