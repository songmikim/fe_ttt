'use client'

import React from 'react'
import styled from 'styled-components'
import FileImages from '@/app/_global/components/FileImages'

const StyledProfileView = styled.div`

  display: flex;
  flex-direction: column;
  gap: 20px;

  dl {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fafafa;

    dt {
      font-weight: bold;
      font-size: 14px;
      color: #333;
    }

    dd {
      margin: 0;
      font-size: 15px;
      color: #555;
    }
    &.profile {
      border: none;
      background: none;
      justify-content: center;
      padding: 0;

      dd img {
        width: 250px;
        height: 250px;
        border-radius: 10%;
        object-fit: cover;
      }
    }
  }
`

type Props = {
  form: {
    email: string
    name: string
    mobile: string
    profileImage?: any
  }
}

const MypageForm = ({ form }: Props) => {
  return (
   <StyledProfileView>
      <dl className="profile">
        <dd>
          <FileImages
            items={form.profileImage}
            width={250}
            height={250}
            viewOrgImage={true}
            viewOnly={true} // 파일 삭제 버튼 숨김
          />
        </dd>
      </dl>

      <dl>
        <dt>이메일</dt>
        <dd>{form.email}</dd>
      </dl>

      <dl>
        <dt>회원명</dt>
        <dd>{form.name}</dd>
      </dl>

      <dl>
        <dt>휴대전화번호</dt>
        <dd>{form.mobile}</dd>
      </dl>
      <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />
    </StyledProfileView>
  )
}

export default React.memo(MypageForm)
