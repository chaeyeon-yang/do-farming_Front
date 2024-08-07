import DropDownPicker from 'react-native-dropdown-picker';
import {
  BoardContainer,
  Container,
  InfoText,
  InputContainer,
  InputTitle,
  SubTitle,
} from './BangJoinScreen.styled';
import React, { useEffect, useState } from 'react';
import { SelectBoxType } from '../../../types/BangTypes';
import CustomModal from '../../../components/CustomModal/CustomModal';
import {
  EnterButton,
  EnterText,
  ModalButton,
  ModalButtonText,
} from '../bangCreate/BangCreateScreen.styled';
import { accountList } from '../../../mocks/userAccount';
import { getChecking } from '../../../apis/accountService';
import {
  CheckingAccount,
  JoinDofarmingType,
} from '../../../types/account/AccountTypes';
import { View } from 'react-native';

export default function BangJoinScreen2({ navigation, route }: any) {
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [outAccount, setOutAccount] = useState<string>('');

  const [myChecking, setMyChecking] = useState<CheckingAccount[]>();
  const [userAccountList, setUserAccountList] = useState<SelectBoxType[]>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [joinDofarming, setJoinDofarming] = useState<JoinDofarmingType>({
    dofarmingProductId: 102,
    withdrawAccountId: 0,
    depositAmount: 1000000,
    accountPassword: '',
  });

  const { bang } = route.params;

  useEffect(() => {
    const fetchMyChecking = async () => {
      await getChecking().then((res) => setMyChecking(res));
    };
    fetchMyChecking();
  }, []);

  useEffect(() => {
    if (myChecking && myChecking.length > 0) {
      const updatedUserAccountList = myChecking.map((element) => ({
        label: `하나은행 ${element.accountNumber}`,
        value: element.id,
      }));
      setUserAccountList(updatedUserAccountList);
    }
  }, [myChecking]);

  useEffect(() => {
    setJoinDofarming((prevjoin) => ({
      ...prevjoin,
      withdrawAccountId: Number(outAccount),
    }));
  }, [outAccount]);

  const onPressModalOpen = () => {
    console.log('팝업을 여는 중입니다.');
    setIsModalVisible(true);
  };

  const onPressBangJoin = () => {
    setIsModalVisible(false);
    const from = 'bangJoin2';
    navigation.navigate('ProductPassword', { joinDofarming, bang, from });
  };

  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Container>
      <SubTitle>도파밍 상품 가입</SubTitle>
      <BoardContainer>
        <InputContainer style={{ zIndex: 1000 }}>
          {accountList && (
            <>
              <InputTitle>출금할 계좌를 선택해주세요.</InputTitle>
              <DropDownPicker
                open={accountOpen}
                value={outAccount}
                items={userAccountList}
                setOpen={setAccountOpen}
                setValue={setOutAccount}
                placeholder="출금 계좌를 선택하세요"
                listMode="SCROLLVIEW"
                maxHeight={100}
                dropDownDirection="BOTTOM"
                placeholderStyle={{ color: '#CCCCCC' }}
                style={{
                  backgroundColor: '#f2f2f5',
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#EEEEEE',
                  zIndex: 2000,
                }}
              />
            </>
          )}
        </InputContainer>
        <InfoText>🚨 상품 가입 금액은 1,000,000원 입니다.</InfoText>
      </BoardContainer>
      <View style={{ marginHorizontal: 20 }}>
        <EnterButton onPressOut={onPressModalOpen} style={{ zIndex: 500 }}>
          <EnterText>가입하기</EnterText>
        </EnterButton>
      </View>
      <CustomModal
        isVisible={isModalVisible}
        onClose={onPressModalClose}
        text={'정보 입력이 완료되었습니다!'}
      >
        <ModalButton onPress={onPressBangJoin}>
          <ModalButtonText>확인</ModalButtonText>
        </ModalButton>
      </CustomModal>
    </Container>
  );
}
