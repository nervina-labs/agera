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
} from '@mui/material'
import { OpenInNew as OpenInNewIcon, Bolt as FastWithdrawalIcon } from '@mui/icons-material'
import { yellow } from '@mui/material/colors'
import BigNumber from 'bignumber.js'

import Address from 'components/TruncatedAddress'
import Pagination from 'components/Pagination'
import { timeDistance, getBridgedRecordListRes, CKB_EXPLORER_URL, CKB_DECIMAL } from 'utils'

type ParsedList = ReturnType<typeof getBridgedRecordListRes>

const BridgedRecordList: React.FC<{
  list: ParsedList
  showUser?: boolean
}> = ({ list, showUser }) => {
  const [t, { language }] = useTranslation('list')
  return (
    <Box sx={{ px: 1, py: 2 }}>
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ textTransform: 'capitalize' }}>
            <TableRow>
              <TableCell component="th">{t('type')}</TableCell>
              <TableCell component="th">{t('value')} </TableCell>
              <TableCell component="th">CKB</TableCell>
              <TableCell component="th">{t('age')} </TableCell>
              {showUser ? <TableCell component="th">{t('account')} </TableCell> : null}
              <TableCell component="th">{t('layer1Txn')} </TableCell>
              <TableCell component="th">{t('block')} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {+list.meta.total ? (
              list.records.map(r => (
                <TableRow key={r.layer1.output.hash + r.layer1.output.index}>
                  <TableCell>
                    <Stack
                      direction="row"
                      sx={{ whiteSpace: 'nowrap', fontSize: { xs: 12, md: 14 } }}
                      alignItems="center"
                    >
                      {r.isFastWithdrawal ? (
                        <Tooltip title={t(`fast-withdrawal`)} placement="top">
                          <FastWithdrawalIcon sx={{ color: yellow[700], fontSize: 20 }} />
                        </Tooltip>
                      ) : null}
                      {t(r.type)}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: 12, md: 14 }, whiteSpace: 'nowrap' }}>
                    {`${new BigNumber(r.value ?? '0').toFormat()} ${r.token.symbol ?? ''}`}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: 12, md: 14 }, whiteSpace: 'nowrap' }}>
                    {`${new BigNumber(r.capacity ?? '0').dividedBy(new BigNumber(CKB_DECIMAL)).toFormat()}`}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: 12, md: 14 } }}>
                    {r.timestamp > 0 ? (
                      <time dateTime={new Date(+r.timestamp).toISOString()}>{timeDistance(r.timestamp, language)}</time>
                    ) : (
                      t('pending')
                    )}
                  </TableCell>
                  {showUser ? (
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Address address={r.to} size="normal" />
                    </TableCell>
                  ) : null}
                  <TableCell>
                    {r.layer1.output.hash ? (
                      <Stack direction="row" alignItems="center">
                        <Tooltip title={r.layer1.output.hash} placement="top">
                          <Box>
                            <Link
                              href={`${CKB_EXPLORER_URL}/transaction/${r.layer1.output.hash}#${r.layer1.output.index}`}
                              underline="none"
                              target="_blank"
                              rel="noopener noreferrer"
                              display="flex"
                              alignItems="center"
                              color="secondary"
                            >
                              <Typography
                                className="mono-font"
                                overflow="hidden"
                                sx={{ userSelect: 'none', fontSize: { xs: 12, md: 14 } }}
                              >
                                {`${r.layer1.output.hash.slice(0, 8)}...${r.layer1.output.hash.slice(-8)}`}
                              </Typography>
                              <OpenInNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
                            </Link>
                          </Box>
                        </Tooltip>
                      </Stack>
                    ) : (
                      t(`pending`)
                    )}
                  </TableCell>
                  <TableCell>
                    {r.block.hash ? (
                      <NextLink href={`/block/${r.block.hash}`}>
                        <Link
                          href={`/block/${r.block.hash}`}
                          underline="none"
                          color="secondary"
                          sx={{
                            fontSize: {
                              xs: 12,
                              md: 14,
                            },
                          }}
                        >
                          {(+r.block.number).toLocaleString('en')}
                        </Link>
                      </NextLink>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showUser ? 7 : 6} align="center">
                  {t(`no_records`)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination total={+list.meta.total} page={+list.meta.page} />
    </Box>
  )
}
export default BridgedRecordList
