import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import {
  Stack,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link,
  Tooltip,
  Chip,
} from '@mui/material'
import BigNumber from 'bignumber.js'
import TxStatusIcon from './TxStatusIcon'
import Address from 'components/TruncatedAddress'
import Pagination from 'components/Pagination'
import PageSize from 'components/PageSize'
import { timeDistance, getTxListRes } from 'utils'

type ParsedTxList = ReturnType<typeof getTxListRes>

const TxList: React.FC<{
  list: ParsedTxList
  showPageSizeSelector?: boolean
  pageSize: number
  maxCount?: string
}> = ({ list, pageSize, showPageSizeSelector, maxCount }) => {
  const [t, { language }] = useTranslation('list')
  return (
    <Box sx={{ px: 1, py: 2 }}>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ textTransform: 'capitalize' }}>
            <TableRow>
              <TableCell component="th">{t('txHash')}</TableCell>
              <TableCell component="th">{t('block')} </TableCell>
              <TableCell component="th">{t('age')} </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} component="th">
                {t('from')}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} component="th">
                {t('to')}
              </TableCell>
              <TableCell sx={{ display: { xs: 'table-cell', md: 'none' } }} component="th">
                {t('transfer')}
              </TableCell>
              <TableCell component="th" sx={{ whiteSpace: 'nowrap' }}>{`${t('value')} (CKB)`}</TableCell>
              <TableCell component="th">{t('type')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {+list.totalCount ? (
              list.txs.map(item => (
                <TableRow key={item.hash}>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      {item.type === 'polyjuice' ? (
                        <TxStatusIcon status={item.status} isSuccess={item.isSuccess} />
                      ) : (
                        <div style={{ display: 'flex', width: 24 }} />
                      )}
                      <Tooltip title={item.hash} placement="top">
                        <Box>
                          <NextLink href={`/tx/${item.hash}`}>
                            <Link href={`/tx/${item.hash}`} underline="none" color="secondary">
                              <Typography
                                className="mono-font"
                                overflow="hidden"
                                sx={{ userSelect: 'none', fontSize: { xs: 12, md: 14 } }}
                              >
                                {`${item.hash.slice(0, 8)}...${item.hash.slice(-8)}`}
                              </Typography>
                            </Link>
                          </NextLink>
                        </Box>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <NextLink href={`/block/${item.blockHash}`}>
                      <Link
                        href={`/block/${item.blockHash}`}
                        underline="none"
                        color="secondary"
                        sx={{
                          fontSize: {
                            xs: 12,
                            md: 14,
                          },
                        }}
                      >
                        {(+item.blockNumber).toLocaleString('en')}
                      </Link>
                    </NextLink>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: 12, md: 14 } }}>
                    <time dateTime={new Date(+item.timestamp).toISOString()}>
                      {timeDistance(item.timestamp, language)}
                    </time>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Address address={item.from} size="normal" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Address address={item.to} size="normal" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'table-cell', md: 'none' } }}>
                    <Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontSize={12} sx={{ textTransform: 'capitalize', mr: 1 }} noWrap>{`${t(
                          'from',
                        )}:`}</Typography>
                        <Address leading={5} address={item.from} />
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontSize={12} sx={{ textTransform: 'capitalize', mr: 1 }} noWrap>{`${t(
                          'to',
                        )}:`}</Typography>
                        <Address leading={5} address={item.to} />
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: 12, md: 14 }, whiteSpace: 'nowrap' }}>{`${new BigNumber(
                    item.value || 0,
                  ).toFormat()}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.type.replace(/_/g, ' ')}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t(`no_records`)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {showPageSizeSelector ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <PageSize pageSize={pageSize} />
          <Pagination total={+list.totalCount} page={+list.page} pageSize={pageSize} />
        </Stack>
      ) : (
        <Pagination total={+list.totalCount} page={+list.page} pageSize={pageSize} />
      )}
      {maxCount ? (
        <Stack direction="row-reverse">
          <Typography color="primary.light" variant="caption">
            {t(`last-n-records`, { n: maxCount })}
          </Typography>
        </Stack>
      ) : null}
    </Box>
  )
}
export default TxList
