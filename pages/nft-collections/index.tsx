import type { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useQuery } from 'react-query'
import { gql } from 'graphql-request'
import { Skeleton } from '@mui/material'
import SubpageHead from 'components/SubpageHead'
import PageTitle from 'components/PageTitle'
import Table from 'components/Table'
import Pagination from 'components/SimplePagination'
import TokenLogo from 'components/TokenLogo'
import HashLink from 'components/HashLink'
import Address from 'components/TruncatedAddress'
import FilterMenu from 'components/FilterMenu'

import { SIZES } from 'components/PageSize'
import NoDataIcon from 'assets/icons/no-data.svg'
import SortIcon from 'assets/icons/sort.svg'
import { client, GraphQLSchema } from 'utils'
import styles from './styles.module.scss'

// TODO: minted count sort
interface Variables {
  name: string | null
  before: string | null
  after: string | null
  limit: number
  holder_count_sort: string
  name_sort: string
}
interface NftCollectionListProps {
  erc721_udts: {
    entries: Array<GraphQLSchema.NftCollectionListItem>
    metadata: GraphQLSchema.PageMetadata
  }
}
enum SortTypesEnum {
  holder_count_sort = 'holder_count_sort',
  name_sort = 'name_sort',
}

const erc721ListQuery = gql`
  query (
    $limit: Int
    $name: String
    $before: String
    $after: String
    $holder_count_sort: SortType
    $name_sort: SortType
  ) {
    erc721_udts(
      input: {
        limit: $limit
        fuzzy_name: $name
        before: $before
        after: $after
        sorter: [
          { sort_type: $holder_count_sort, sort_value: EX_HOLDERS_COUNT }
          { sort_type: $name_sort, sort_value: NAME }
        ]
      }
    ) {
      entries {
        id
        name
        symbol
        icon
        account {
          eth_address
          bit_alias
        }
        holders_count
        minted_count
      }
      metadata {
        total_count
        after
        before
      }
    }
  }
`

const fetchErc721List = (variables: Variables): Promise<NftCollectionListProps['erc721_udts']> =>
  client
    .request<NftCollectionListProps>(erc721ListQuery, variables)
    .then(data => data.erc721_udts)
    .catch(error => {
      console.error(error)
      return {
        entries: [],
        metadata: {
          total_count: 0,
          before: null,
          after: null,
        },
      }
    })
const FILTER_KEYS = ['name']

const NftCollectionList = () => {
  const {
    push,
    asPath,
    query: {
      before = null,
      after = null,
      name = null,
      page_size = SIZES[1],
      holder_count_sort = 'DESC',
      name_sort = 'DESC',
      ...restQuery
    },
  } = useRouter()
  const [t] = useTranslation(['nft', 'common', 'list'])
  const title = t(`nft-collections`)

  const { isLoading, data: list } = useQuery(
    ['erc721-list', page_size, before, after, name, holder_count_sort, name_sort],
    () =>
      fetchErc721List({
        before: before as string,
        after: after as string,
        name: name ? `${name}%` : null,
        limit: Number.isNaN(!page_size) ? +SIZES[1] : +page_size,
        holder_count_sort: holder_count_sort as string,
        name_sort: name_sort as string,
      }),
    { refetchInterval: 10000 },
  )

  const handleSorterClick = (e: React.MouseEvent<HTMLOrSVGElement>, type) => {
    const {
      dataset: { order },
    } = e.currentTarget
    push(
      `${asPath.split('?')[0] ?? ''}?${new URLSearchParams({
        ...restQuery,
        name: name ? (name as string) : '',
        page_size: page_size as string,
        holder_count_sort: holder_count_sort as string,
        name_sort: name_sort as string,
        [type]: order === 'ASC' ? 'DESC' : 'ASC',
      })}`,
    )
  }

  return (
    <>
      <SubpageHead subtitle={title} />
      <div className={styles.container}>
        <PageTitle>{title}</PageTitle>
        <div className={styles.list}>
          <div className={styles.subheader}>
            <span>
              {t(`n_kinds_in_total`, {
                ns: 'list',
                number: list?.metadata.total_count.toLocaleString('en') ?? '-',
              })}
            </span>
            {list?.metadata.total_count ? <Pagination {...list.metadata} /> : null}
          </div>
          <Table>
            <thead>
              <tr>
                <th>
                  {t('token')}
                  <span className={styles['pr-6']}>
                    <FilterMenu filterKeys={[FILTER_KEYS[0]]} />
                  </span>
                  <SortIcon
                    onClick={e => handleSorterClick(e, SortTypesEnum.name_sort)}
                    data-order={name_sort}
                    className={styles.sorter}
                  />
                </th>
                <th>{t('address')} </th>
                <th>
                  <span className={styles['pr-6']}>{t('holder_count')}</span>
                  <SortIcon
                    onClick={e => handleSorterClick(e, SortTypesEnum.holder_count_sort)}
                    data-order={holder_count_sort}
                    className={styles.sorter}
                  />
                </th>
                <th>{t('minted_count')}</th>
              </tr>
            </thead>
            <tbody>
              {list?.metadata.total_count ? (
                list.entries.map(item => {
                  const domain = item?.account?.bit_alias

                  return (
                    <tr key={item.id}>
                      <td title={item.name}>
                        <NextLink href={`/nft-collection/${item.account.eth_address}`}>
                          <a className={styles.token}>
                            <TokenLogo name={item.name} logo={item.icon} />
                            <span>
                              {item.name ?? '-'}
                              {item.symbol ? `(${item.symbol})` : ''}
                            </span>
                          </a>
                        </NextLink>
                      </td>
                      <td className={styles.addr} title={item.account.eth_address}>
                        {domain ? (
                          <div className={styles['address-with-domain']}>
                            <Address address={item.account.eth_address} domain={domain} />
                          </div>
                        ) : (
                          <>
                            <HashLink label={item.account.eth_address} href={`/account/${item.account.eth_address}`} />
                            <span className="tooltip" data-tooltip={item.account.eth_address}>
                              <HashLink
                                label={`${item.account.eth_address.slice(0, 8)}...${item.account.eth_address.slice(
                                  -8,
                                )}`}
                                href={`/account/${item.account.eth_address}`}
                              />
                            </span>
                          </>
                        )}
                      </td>
                      <td title={(+item.holders_count).toLocaleString('en')}>
                        {(+item.holders_count).toLocaleString('en')}
                      </td>
                      <td title={(+item.minted_count).toLocaleString('en')}>
                        {(+item.minted_count).toLocaleString('en')}
                      </td>
                    </tr>
                  )
                })
              ) : isLoading ? (
                Array.from({ length: +page_size }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={4}>
                      <Skeleton animation="wave" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className={styles.noRecords}>
                      <NoDataIcon />
                      <span>{t(`no_records`, { ns: 'list' })}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {list?.metadata.total_count ? <Pagination {...list.metadata} /> : null}
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lng = await serverSideTranslations(locale, ['common', 'nft', 'list'])
  return { props: lng }
}

NftCollectionList.displayName = 'NftCollectionList'

export default NftCollectionList
