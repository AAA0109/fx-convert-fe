import CloseIcon from '@mui/icons-material/Close';
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { GridSearchIcon, useGridApiRef } from '@mui/x-data-grid-pro';
import { clientApiState, selectedWalletDetailedActivity } from 'atoms';
import { useWalletGridColumns } from 'hooks/useWalletGridColumns';
import {
  PangeaBrokerCorpayFxBalanceCompanyListParams,
  PangeaFXBalanceAccountsResponseItem,
  PangeaPaginatedCompanyFXBalanceAccountHistoryList,
} from 'lib';
import { isError } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import InsightsContainer from './InsightsContainer';
import WalletContainer from './WalletContainer';
import WalletMenuButton from './WalletMenuButton';
import WalletOverview from './WalletOverview';
import WalletsGrid from './WalletsGrid';

const WalletsTab = () => {
  const selectedWallet = useRecoilValue(selectedWalletDetailedActivity);
  const authHelper = useRecoilValue(clientApiState);
  const api = authHelper.getAuthenticatedApiHelper();
  const [searchText, setSearchText] = useState('');
  const [walletList, setWalletList] = useState<
    PangeaFXBalanceAccountsResponseItem[]
  >([]);
  const [balances, setBalances] = useState<
    PangeaFXBalanceAccountsResponseItem[]
  >([]);
  const gridApiRef = useGridApiRef();
  const columns = useWalletGridColumns(
    ['date', 'order_number', 'wallet', 'amount', 'currency', 'balance'],
    gridApiRef,
  );
  const [allWalletsActivity, setAllWalletsActivity] =
    useState<PangeaPaginatedCompanyFXBalanceAccountHistoryList | null>(null);
  const [displayWallets, setDisplayWallets] = useState<
    PangeaFXBalanceAccountsResponseItem[]
  >([]);
  const [displayBalances, setDisplayBalances] = useState<
    PangeaFXBalanceAccountsResponseItem[]
  >([]);
  const [showBackdrop, setShowBackdrop] = useState(walletList.length == 0);
  useEffect(() => {
    dashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardData = async () => {
    setShowBackdrop(true);
    const query: PangeaBrokerCorpayFxBalanceCompanyListParams = {
      limit: 100,
      offset: 0,
    };
    await Promise.all([
      api.getAllWalletsActivityData(query),
      api.getWalletsAsync(),
    ])
      .then(([walletsActivityResponse, walletsResponse]) => {
        if (!isError(walletsResponse)) {
          const sorttedWallets = sortWallets(walletsResponse.items);
          const filteredBalance = sortBalances(
            walletsResponse.items.filter((wallet) => wallet.available_balance),
          );
          setWalletList(sorttedWallets);
          setBalances(filteredBalance);
          if (walletsResponse.items.length > 6) {
            setDisplayWallets(sorttedWallets.slice(0, 6));
            setDisplayBalances([
              ...filteredBalance.slice(0, 6),
              filteredBalance.slice(7).reduce(
                (prev, acc) => {
                  return {
                    ...prev,
                    available_balance:
                      prev.available_balance + acc.available_balance,
                    curr: '',
                    id: '99',
                  };
                },
                {
                  available_balance: 0,
                  curr: '',
                  id: '99',
                } as PangeaFXBalanceAccountsResponseItem,
              ),
            ]);
          } else {
            setDisplayBalances(filteredBalance);
            setDisplayWallets(sorttedWallets);
          }
        }
        if (!isError(walletsActivityResponse)) {
          setAllWalletsActivity(walletsActivityResponse);
        }
        return [walletsActivityResponse, walletsResponse];
      })
      .finally(() => {
        setShowBackdrop(false);
      });
  };

  const sortWallets = (wallets: PangeaFXBalanceAccountsResponseItem[]) => {
    return wallets
      .sort((a, b) => {
        if (a.available_balance < b.available_balance) {
          return -1;
        }
        if (a.available_balance > b.available_balance) {
          return 1;
        }
        return 0;
      })
      .reverse();
  };

  const sortBalances = (wallets: PangeaFXBalanceAccountsResponseItem[]) => {
    return wallets
      .sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.available_balance! < b.available_balance!) {
          return -1;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.available_balance! > b.available_balance!) {
          return 1;
        }
        return 0;
      })
      .reverse();
  };

  useEffect(() => {
    if (searchText.length === 0 && walletList.length > 6) {
      setDisplayWallets(walletList.slice(0, 6));
    } else {
      setDisplayWallets(
        walletList.filter((wallet) => {
          return wallet.curr_text
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <>
      {selectedWallet == null ? (
        <Stack direction='column' justifyContent='center' spacing={1}>
          <Typography
            variant='h4'
            component='h1'
            style={{ paddingTop: '40px' }}
          >
            Wallets
          </Typography>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            spacing={0}
            sx={{ paddingBottom: '8px' }}
          >
            <Typography variant='body2' component='p'>
              View and manage your FX wallets.
            </Typography>
            <Stack direction='row' spacing={2}>
              <FormControl>
                <InputLabel size='small' variant='outlined' shrink>
                  Search
                </InputLabel>

                <OutlinedInput
                  size='small'
                  onChange={(event) => setSearchText(event.target.value)}
                  sx={{
                    width: '180px',
                    backgroundColor: 'transparent',
                    '& input': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  value={searchText}
                  endAdornment={
                    searchText.length > 0 ? (
                      <IconButton
                        onClick={() => setSearchText('')}
                        sx={{
                          '& svg': {
                            color: 'black',
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <GridSearchIcon />
                    )
                  }
                  placeholder='Search wallets'
                  label='searchwallets'
                  aria-label='searchwallets'
                  notched={true}
                />
              </FormControl>
              <WalletMenuButton />
            </Stack>
          </Stack>
          <WalletContainer
            displayWallets={displayWallets}
            walletList={walletList}
            showBackdrop={showBackdrop}
            setDisplayWallets={setDisplayWallets}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <Typography
            variant='h4'
            component='h1'
            style={{ paddingTop: '40px' }}
          >
            Insights
          </Typography>
          <InsightsContainer
            displayBalances={displayBalances}
            balances={balances}
            setDisplayBalances={setDisplayBalances}
          />
          {allWalletsActivity?.results != undefined && (
            <>
              <Typography
                variant='h4'
                component='h1'
                style={{ paddingTop: '40px' }}
              >
                Activity
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  paddingBottom: '8px',
                }}
              >
                View payment and transfer activity for your wallets.
              </Typography>
              <WalletsGrid
                walletRows={allWalletsActivity.results}
                columns={columns}
                gridApiRef={gridApiRef}
              ></WalletsGrid>
            </>
          )}
        </Stack>
      ) : (
        <WalletOverview />
      )}
    </>
  );
};

export default WalletsTab;
