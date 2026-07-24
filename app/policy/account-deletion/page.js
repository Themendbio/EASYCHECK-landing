'use client';
// EASYCHECK 계정·데이터 삭제 요청 안내 페이지(Google Play 데이터 삭제 링크 대상)
import { useEffect } from 'react';
import Link from 'next/link';
import PolicyNav from '../policy-nav';

const CONTACT_EMAIL = 'joonlee@yonsei.ac.kr';

export default function AccountDeletionPage() {
    useEffect(() => {
        document.title = 'EASYCHECK 계정 및 데이터 삭제 안내';
    }, []);

    return (
        <article className="mx-auto max-w-3xl container-x py-12 lg:py-16">
            <PolicyNav />
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-primary mb-2">
                EASYCHECK
            </p>
            <h1 className="text-[26px] lg:text-[32px] font-bold text-text-primary leading-[1.3] mb-2">
                계정 및 데이터 삭제 안내
            </h1>
            <p className="text-[13px] text-text-tertiary mb-10">최종 업데이트: 2026년 7월 24일</p>

            <p
                className="text-[15px] text-text-secondary leading-[1.7] mb-10"
                style={{ wordBreak: 'keep-all' }}
            >
                EASYCHECK(패키지명 <code className="text-text-primary">com.themend.easycheck</code>)
                사용자는 언제든지 계정과 관련 데이터의 삭제를 요청할 수 있습니다. 아래 방법 중 하나를
                이용해 주세요.
            </p>

            <Section title="1. 앱에서 직접 삭제하기">
                <ol className="list-decimal pl-5 space-y-2 text-[15px] text-text-secondary leading-[1.7]">
                    <li>EASYCHECK 앱을 실행하고 로그인합니다.</li>
                    <li>하단 <b>프로필(내 정보)</b> 탭으로 이동합니다.</li>
                    <li><b>회원 탈퇴</b>를 선택합니다.</li>
                    <li>안내에 따라 확인하면 계정과 개인정보가 즉시 삭제·파기됩니다.</li>
                </ol>
                <Note>
                    앱을 삭제(제거)하는 것만으로는 서버에 저장된 데이터가 삭제되지 않습니다. 완전한
                    삭제를 원하시면 반드시 회원 탈퇴를 진행해 주세요.
                </Note>
            </Section>

            <Section title="2. 앱 없이 삭제 요청하기">
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                    앱을 삭제했거나 로그인할 수 없는 경우, 아래 이메일로 가입에 사용한 정보를 기재해
                    삭제를 요청하실 수 있습니다. 접수 후 10일 이내에 처리하고 결과를 회신드립니다.
                </p>
                <ul className="mt-3 space-y-1.5 text-[15px] text-text-secondary leading-[1.7]">
                    <li>
                        문의 이메일:{' '}
                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=계정 삭제 요청`}
                            className="text-brand-primary hover:underline focus-ring rounded-sm"
                        >
                            {CONTACT_EMAIL}
                        </a>
                    </li>
                    <li>제목: “계정 삭제 요청”</li>
                    <li>본문: 가입 시 사용한 카카오 계정 이메일 또는 닉네임</li>
                </ul>
            </Section>

            <Section title="3. 삭제되는 데이터">
                <p className="text-[15px] text-text-secondary leading-[1.7] mb-3">
                    회원 탈퇴 시 아래 개인정보가 <b>즉시 파기 또는 익명화</b>됩니다.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-text-secondary leading-[1.7]">
                    <li>이름(닉네임), 이메일, 전화번호, 카카오 계정 연결 정보, 프로필 이미지 URL</li>
                    <li>성별, 출생연도, 키, 몸무게</li>
                    <li>보호자 전화번호</li>
                    <li>연결된 기기 정보(모델명·MAC 주소) 및 푸시 알림 토큰(FCM)</li>
                    <li>모든 로그인 세션</li>
                </ul>
            </Section>

            <Section title="4. 보관되는 데이터 및 보관 기간">
                <p className="text-[15px] text-text-secondary leading-[1.7] mb-3">
                    관계 법령 준수를 위해, 아래 데이터는 개인을 식별할 수 없도록 처리하거나 법정 보관
                    기간 동안만 보관된 뒤 지체 없이 파기됩니다.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[14px]">
                        <thead>
                            <tr className="bg-bg-subtle">
                                <Th>항목</Th>
                                <Th>보관 기간</Th>
                                <Th>근거</Th>
                            </tr>
                        </thead>
                        <tbody>
                            <Tr>
                                <Td>생체신호 및 탈수 분석 결과</Td>
                                <Td>측정일로부터 90일(회원 탈퇴 시 지체 없이 파기)</Td>
                                <Td>「개인정보 보호법」 제21조</Td>
                            </Tr>
                            <Tr>
                                <Td>서비스 이용 로그(로그인 일시, 기기 정보 등)</Td>
                                <Td>3개월</Td>
                                <Td>부정이용 방지 및 오류 대응</Td>
                            </Tr>
                            <Tr>
                                <Td>결제·구독 관련 기록</Td>
                                <Td>5년</Td>
                                <Td>전자상거래 등에서의 소비자보호에 관한 법률</Td>
                            </Tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            <p className="mt-12 pt-6 border-t border-border text-[14px] text-text-tertiary leading-[1.7]">
                개인정보 처리에 관한 전체 내용은{' '}
                <Link href="/policy/privacy" className="text-brand-primary hover:underline focus-ring rounded-sm">
                    개인정보처리방침
                </Link>
                에서 확인하실 수 있습니다.
            </p>
        </article>
    );
}

function Section({ title, children }) {
    return (
        <section className="mb-10">
            <h2 className="text-[18px] lg:text-[20px] font-semibold text-text-primary mb-3">
                {title}
            </h2>
            {children}
        </section>
    );
}

function Note({ children }) {
    return (
        <div className="mt-4 flex gap-3 bg-bg-subtle border border-border rounded-lg px-4 py-3">
            <p
                className="text-[14px] text-text-secondary leading-[1.6] m-0"
                style={{ wordBreak: 'keep-all' }}
            >
                {children}
            </p>
        </div>
    );
}

function Th({ children }) {
    return (
        <th className="border border-border px-3 py-2 text-left font-semibold text-text-primary align-top">
            {children}
        </th>
    );
}

function Td({ children }) {
    return (
        <td className="border border-border px-3 py-2 text-text-secondary align-top" style={{ wordBreak: 'keep-all' }}>
            {children}
        </td>
    );
}

function Tr({ children }) {
    return <tr>{children}</tr>;
}
