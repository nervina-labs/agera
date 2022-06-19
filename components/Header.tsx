import { useState } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Link,
  Button,
  Menu,
  MenuList,
  MenuItem,
  Typography,
  IconButton,
  MenuProps,
  Backdrop,
} from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import { Language as LanguageIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { EXPLORER_TITLE, IMG_URL, GW_VERSION } from 'utils'

const TOKEN_TYPE_LIST = ['bridge', 'native']
const CHAIN_TYPE_LIST = GW_VERSION ? ['testnet'] : ['mainnet', 'testnet']
const LOCALE_LIST = ['en-US', 'zh-CN']

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }),
)

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDown color="secondary" sx={{ ml: '2px', fontSize: 32 }} />}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiAccordionSummary-content.Mui-expanded': {
    color: theme.palette.primary.main,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    'transform': 'rotate(180deg)',
    '& svg': {
      color: theme.palette.primary.main,
    },
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  'padding': `0 ${theme.spacing(1)}`,
  '& .MuiList-root': {
    'padding': 0,
    '& a': {
      fontSize: '0.9rem',
    },
  },
}))

const StyledMenu = styled((props: MenuProps) => <Menu {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(1),
  },
  '& .MuiMenuItem-root': {
    '& :hover': {
      color: theme.palette.primary.main,
    },
    '& a': {
      color: theme.palette.secondary.main,
    },
  },
}))

const MobileMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorReference="anchorPosition"
    anchorPosition={{ top: 54, left: 0 }}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    'width': '100%',
    'maxWidth': '100%',
    'maxHeight': 750,
    'left': '0 !important',
    'borderRadius': 0,
    'border': 'none',
    'backgroundColor': theme.palette.primary.light,
    '& .MuiMenu-list': {
      padding: '4px 0',
      width: '100%',
    },
  },
}))

const Header = () => {
  const [t, { language }] = useTranslation('common')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [expanded, setExpanded] = useState<string | false>('')

  const anchorElLabel = anchorEl?.getAttribute('aria-label')
  const { asPath } = useRouter()
  const isHome = asPath === '/'

  const handleMobileMenuChange = (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  const handleMenuListOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleMenuListClose = () => setAnchorEl(null)

  const TokenMenuItems = ({ dense }) => (
    <MenuList dense={dense}>
      {TOKEN_TYPE_LIST.map(type => (
        <MenuItem key={type} onClick={handleMenuListClose} sx={{ p: 0 }}>
          <NextLink href={`/tokens/${type}`} passHref>
            <Link
              href={`/tokens/${type}`}
              title={t(`${type}-udt`)}
              underline="none"
              sx={{ width: '100%', padding: '6px 16px' }}
              color="secondary"
            >
              {t(`${type}-udt`)}
            </Link>
          </NextLink>
        </MenuItem>
      ))}
    </MenuList>
  )

  const ChainMenuItems = ({ dense }) => (
    <MenuList dense={dense}>
      {CHAIN_TYPE_LIST.map(chain => {
        const url = `https://${
          chain === 'mainnet'
            ? process.env.NEXT_PUBLIC_MAINNET_EXPLORER_HOSTNAME
            : process.env.NEXT_PUBLIC_TESTNET_EXPLORER_HOSTNAME
        }/${language}`
        return (
          <MenuItem key={chain} onClick={handleMenuListClose} sx={{ p: 0 }}>
            <NextLink href={url} passHref>
              <Link
                href={url}
                title={t(chain)}
                underline="none"
                sx={{ width: '100%', padding: '6px 16px' }}
                color="secondary"
              >
                {t(chain)}
              </Link>
            </NextLink>
          </MenuItem>
        )
      })}
    </MenuList>
  )

  const LocaleMenuItems = ({ dense }) => (
    <MenuList dense={dense}>
      {LOCALE_LIST.map(locale => (
        <MenuItem key={locale} onClick={handleMenuListClose} sx={{ p: 0 }}>
          <NextLink href={asPath} locale={locale} passHref>
            <Link title={t(locale)} underline="none" sx={{ width: '100%', padding: '6px 16px' }} color="secondary">
              {t(locale)}
            </Link>
          </NextLink>
        </MenuItem>
      ))}
    </MenuList>
  )

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: isHome || anchorElLabel === 'mobile-menu' ? 'primary.light' : '#F8F8FB', boxShadow: 'none' }}
    >
      <Container>
        <Toolbar sx={{ flexGrow: 1 }} disableGutters>
          <NextLink href="/" passHref>
            <Link
              href="/"
              title={EXPLORER_TITLE}
              underline="none"
              mr="auto"
              display="flex"
              sx={{
                alignItems: {
                  xs: 'end',
                  sm: 'center',
                },
              }}
            >
              <Image
                src={`${IMG_URL}nervina-logo-primary.svg`}
                loading="lazy"
                width="96"
                height="23"
                layout="fixed"
                alt="logo"
              />
            </Link>
          </NextLink>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button aria-label="home" onClick={handleMenuListOpen} disableRipple sx={{ textTransform: 'none', mx: 2 }}>
              <NextLink href={`/`} passHref>
                <Link href={`/`} title={t(`home`)} underline="none" color="secondary">
                  {t(`home`)}
                </Link>
              </NextLink>
            </Button>
            <Button
              aria-label="token-list"
              aria-haspopup="true"
              aria-expanded={anchorElLabel === 'token-list' ? 'true' : undefined}
              aria-controls={anchorElLabel === 'token-list' ? 'token-list' : undefined}
              onClick={handleMenuListOpen}
              color="secondary"
              disableRipple
              sx={{ 'textTransform': 'none', 'mx': 2, '& .MuiButton-endIcon': { m: 0 } }}
              endIcon={anchorElLabel === 'token-list' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              {t(`token`)}
            </Button>
            <StyledMenu
              id="token-list"
              anchorEl={anchorEl}
              open={anchorElLabel === 'token-list'}
              onClose={handleMenuListClose}
              MenuListProps={{ 'aria-labelledby': 'token-item' }}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <TokenMenuItems dense />
            </StyledMenu>
            <Button
              aria-label="contract-list"
              aria-haspopup="true"
              aria-expanded={anchorElLabel === 'contract-list' ? 'true' : undefined}
              aria-controls={anchorElLabel === 'contract-list' ? 'contract-list' : undefined}
              onClick={handleMenuListOpen}
              color="secondary"
              disableRipple
              sx={{ textTransform: 'none', mx: 2 }}
            >
              <NextLink href={`/contracts`} passHref>
                <Link href={`/contracts`} title={t(`contracts`)} underline="none" color="secondary">
                  {t(`contracts`)}
                </Link>
              </NextLink>
            </Button>
            <Button
              aria-label="more-list"
              aria-haspopup="true"
              aria-expanded={anchorElLabel === 'more-list' ? 'true' : undefined}
              aria-controls={anchorElLabel === 'more-list' ? 'more-list' : undefined}
              onClick={handleMenuListOpen}
              color="secondary"
              disableRipple
              sx={{ textTransform: 'none', mx: 2 }}
            >
              <NextLink href={`/charts`} passHref>
                <Link href={`/charts`} title={t(`charts`)} underline="none" color="secondary">
                  {t(`charts`)}
                </Link>
              </NextLink>
            </Button>
            <Button
              aria-label="chain-type"
              aria-haspopup="true"
              aria-expanded={anchorElLabel === 'chain-type' ? 'true' : undefined}
              aria-controls={anchorElLabel === 'chain-type' ? 'chain-type' : undefined}
              onClick={handleMenuListOpen}
              color="secondary"
              disableRipple
              sx={{ 'textTransform': 'none', 'mx': 2, '& .MuiButton-endIcon': { m: 0 } }}
              endIcon={anchorElLabel === 'chain-type' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              {t(process.env.NEXT_PUBLIC_CHAIN_TYPE || CHAIN_TYPE_LIST[1])}
            </Button>
            <StyledMenu
              id="chain-type"
              anchorEl={anchorEl}
              open={anchorElLabel === 'chain-type'}
              onClose={handleMenuListClose}
              MenuListProps={{ 'aria-labelledby': 'chain-type' }}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <ChainMenuItems dense />
            </StyledMenu>
            <Button
              aria-label="i18n"
              aria-haspopup="true"
              aria-expanded={anchorElLabel === 'i18n' ? 'true' : undefined}
              aria-controls={anchorElLabel === 'i18n' ? 'i18n' : undefined}
              onClick={handleMenuListOpen}
              color="secondary"
              disableRipple
              sx={{ 'textTransform': 'none', 'mx': 2, '& [class^=MuiButton-]': { ml: 0, mr: 0.5 } }}
              startIcon={<LanguageIcon fontSize="small" />}
              endIcon={anchorElLabel === 'i18n' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              {language === 'zh-CN' ? '中文' : 'Eng'}
            </Button>
            <StyledMenu
              id="i18n"
              anchorEl={anchorEl}
              open={anchorElLabel === 'i18n'}
              onClose={handleMenuListClose}
              MenuListProps={{ 'aria-labelledby': 'locale' }}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <LocaleMenuItems dense />
            </StyledMenu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              aria-label="mobile-menu"
              size="small"
              aria-haspopup="true"
              onClick={handleMenuListOpen}
              color="secondary"
            >
              <Image
                src={anchorElLabel === 'mobile-menu' ? `${IMG_URL}close.svg` : `${IMG_URL}mobile-menu.svg`}
                loading="lazy"
                color="red"
                width="20"
                height="20"
                layout="fixed"
                alt="mobile-expand-icon"
              />
            </IconButton>
            <Backdrop
              sx={{ zIndex: theme => theme.zIndex.drawer + 1, top: 56 }}
              open={anchorElLabel === 'mobile-menu'}
            />
            <MobileMenu
              id="mobile-menu"
              anchorEl={anchorEl}
              open={anchorElLabel === 'mobile-menu'}
              onClose={handleMenuListClose}
              MenuListProps={{ 'aria-labelledby': 'mobile-menu' }}
              sx={{
                textTransform: 'capitalize',
                display: { xs: 'block', md: 'none' },
              }}
              autoFocus={false}
            >
              <MenuItem>
                <NextLink href={`/`} passHref>
                  <Link href={`/`} title={t(`home`)} underline="none">
                    <Typography
                      variant="body1"
                      textAlign="left"
                      color={isHome ? 'primary' : 'secondary'}
                      sx={{ display: { xs: 'block', md: 'none', pointerEvents: 'none' } }}
                    >
                      {t(`home`)}
                    </Typography>
                  </Link>
                </NextLink>
              </MenuItem>
              <Accordion expanded={expanded === 'token'} onChange={handleMobileMenuChange('token')}>
                <AccordionSummary aria-controls="token-content" id="token-header">
                  <Typography>{t(`token`)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TokenMenuItems dense={false} />
                </AccordionDetails>
              </Accordion>
              <MenuItem>
                <NextLink href={`/contracts`} passHref>
                  <Link href={`/contracts`} title={t(`contracts`)} underline="none">
                    <Typography
                      variant="body1"
                      textAlign="left"
                      color={asPath.startsWith('/contracts') ? 'primary' : 'secondary'}
                      sx={{ display: { xs: 'block', md: 'none', pointerEvents: 'none' } }}
                    >
                      {t(`contracts`)}
                    </Typography>
                  </Link>
                </NextLink>
              </MenuItem>
              <MenuItem>
                <NextLink href={`/charts`} passHref>
                  <Link href={`/charts`} title={t(`charts`)} underline="none">
                    <Typography
                      variant="body1"
                      textAlign="left"
                      color={asPath.startsWith('/charts') ? 'primary' : 'secondary'}
                      sx={{ display: { xs: 'block', md: 'none', pointerEvents: 'none' } }}
                    >
                      {t(`charts`)}
                    </Typography>
                  </Link>
                </NextLink>
              </MenuItem>
              <Accordion expanded={expanded === 'chainType'} onChange={handleMobileMenuChange('chainType')}>
                <AccordionSummary aria-controls="chainType-content" id="chainType-header">
                  <Typography>{t(`chainType`)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ChainMenuItems dense={false} />
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'language'} onChange={handleMobileMenuChange('language')}>
                <AccordionSummary aria-controls="language-content" id="language-header">
                  <Typography>{t(`language`)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <LocaleMenuItems dense={false} />
                </AccordionDetails>
              </Accordion>
            </MobileMenu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
