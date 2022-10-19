import parseISO from "date-fns/parseISO";

import { getPayee, transactionService } from "./transaction.service";
import { Transaction } from "./transaction.types";

describe("transaction.service", () => {
  describe("getPayee", () => {
    it("reads Uber Eats payee", () => {
      const messageText = `
        ---------- Forwarded message ---------
        From: Uber Receipts <noreply@uber.com>
        Date: Sun, 9 Oct 2022 at 19:38
        Subject: Your Sunday evening order with Uber Eats
        To: <example@example.com>





        Total PLN 69.02
        9 October 2022



        Thanks for ordering, John
        Here's your receipt for McDonald's® - Ursynów.

        Rate order
        <https://email.uber.com/ls/click?upn=PvPLYFgIPSLtJDhc42E7Kaf7carpLIkoaFGAfpwjX6qRff-2B0MwHVz60SDJqe3A1sIeYSd6dGw5J7fJpoG0i-2B3am9NeSKEbPhKDx14KnI6TDJ6oPFVhpMyIAJRkoG1PuGtuMm4ZT2HFlrKSaGDtdB-2FpICd-2FODyLusfggzTkcgpfKWMkDMmPk0ny-2Bhpo3-2BC87yPI4zW4VWQjT7IdmBEZcgQip9JigH4rZo40lC42btCngKux-2F6yihZpJV3oTL4GwlV4tja24JDzwb9Ea1W-2F8xP3AyKvtbcFfzitUcUYVG1Kh2OS2k19oZUwje9i-2BqIhTKPxdKH_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj74kfBJgSD9voxFvmzKOCY6JQ8cOsG6kH6-2BXtPDZfq54HQMHUdos-2Bj45IwqlpYE388JCMnINSBq0bCFCUonHLm-2BIus8m3D9DJt5lGyWHaLCc761J4iLLiuzVFfG6MOSlNb5PVq2uatUUQLo-2BjR1v9jgtnSEu4dMRjwR2nGpCbECm2LPgzlSwsUasm3d20xkjig-3D-3D>
        Rate order
        <https://email.uber.com/ls/click?upn=PvPLYFgIPSLtJDhc42E7Kaf7carpLIkoaFGAfpwjX6qRff-2B0MwHVz60SDJqe3A1sIeYSd6dGw5J7fJpoG0i-2B3am9NeSKEbPhKDx14KnI6TDJ6oPFVhpMyIAJRkoG1PuGtuMm4ZT2HFlrKSaGDtdB-2FpICd-2FODyLusfggzTkcgpfKWMkDMmPk0ny-2Bhpo3-2BC87yPI4zW4VWQjT7IdmBEZcgQip9JigH4rZo40lC42btCngKux-2F6yihZpJV3oTL4GwlV4tja24JDzwb9Ea1W-2F8xP3AyKvtbcFfzitUcUYVG1Kh2OS2k19oZUwje9i-2BqIhTKP8td2_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj0pEbYxZZzFvpWIG1b31BBrhZ-2FdA77lUlugiOZ2rAtLhmXhX-2B7QO96bDx4jpb1dw65ol7f9F1A7fU1ipkCN6yeYF9pwwZdNGwcbnt2KtMCZLwkqNvgwbx6nuyw-2Fo-2B0Sq5u2EN15WUVIEpEES0u1U4lXetEmxgOky6JNhfpWH2HTnuwLOKWPfv0fdMxRZvVZ2kA-3D-3D>

        Total PLN 69.02

        To view your full receipt go to Uber Eats
        <https://email.uber.com/ls/click?upn=PvPLYFgIPSLtJDhc42E7Kaf7carpLIkoaFGAfpwjX6qsnXbPnE2ppKd-2F2k3WGWSzGw3cYF4UtUSF0VI7Jllz5bXdu4el2a-2Fao4RbMIJNF-2Bg-3Dw-YD_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj5vGyxD6I6xmbLOh72TkBggcpl4HLTQSmFwh4U4gGo7QIT5EGrmBGxlrYQ3oaUAVVh3y1SlHl513Q0jvHRPZuv5J-2FcfkTUBAU9Vb109-2FIqBnry0am9Fd-2B5Q9HqWCNDP4JclnmQHfX3IeYuA1Yt7nHyyYtCl1aHAvehanuscQ6eVNnJoOhWOuso0T3N1HhKFsSg-3D-3D>,
        or download this PDF
        <https://email.uber.com/ls/click?upn=PvPLYFgIPSLtJDhc42E7Kaf7carpLIkoaFGAfpwjX6qoKixWgDvJekLzk3toXLAraUw-2FE1Gjfu-2FDiajkmng8lUzI-2BztmBGNvXAVWrAQcldAKaP-2FNYpbMIJLHwogmN9aBMbZhhSUZHuBoliFfojxZcQ-3D-3D7zs-_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj3hpee13OH9w3cOXgqcQokP-2BLkP-2FRPnW9OlPHW56MYhb2PjywrTM7AWmCBg0rjKgjeY6Xa2WiUsQF3foi1Nfs5tEOdWrUGyVMeLyeeAg-2BY5t9UtohTd1T-2BlxdQ8Qtby47dmDsS7lrHd92B3H-2BbLR2zs-2B21tQI5qXJPgDsxC6KpAqzpSzB6ixA7Wqet4h4i-2BqEQ-3D-3D>

        Payments
        Apple Pay Mastercard ••••0000
        09/10/2022 19:38 PLN 69.02
        A temporary hold of PLN 69.02 was placed on your payment method Apple Pay
        Mastercard ••••0000. This is not a charge and will be removed. It should
        disappear from your bank statement shortly. Learn more
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzQRKXk-2BkHC8JHXsmguglHRmkzqEQBpgKmsFOo24-2BWx5RYrz6jjPTLwjpvvckelD1q0-2F2t13PPAIieAQo5oNfk5LDvgl5pjzXj2mbzyFvSoemTIukS1M6dVMvi2V9EfBKFibKBzFWS6mY-2Fju5mJwLBEHyWS_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj6595ObjhmnxHauds-2BHM521Y-2FkRwRFpNW4RGk1qj2FV-2BpgAsCPsKQc6ykUyxcTUbbOdHrcQ7Y9rmg04Mvxmzu-2BStzGkayL7CWI8u7L4dw44PdJ8mB5RJRTJ-2BSl7b3S9pCqK-2BKfi7jCB5jZ5IA9y79-2F3RWKagheplbUR8Ho9BG4yBT1HooZaod8iE2VGywVOrMA-3D-3D>
        Visit the order page
        <https://email.uber.com/ls/click?upn=PvPLYFgIPSLtJDhc42E7Kaf7carpLIkoaFGAfpwjX6o7R4g6RfaauJZ8XteO4MzX7Ksc_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj-2BTTSBsv9JS5Y9PgkYTrZb6xqs73YTCko-2B-2BwQdzlNMmLGt9Gp0tefGFAFk1aG5cVYiyktG3vj6w89JyML6TXSzLSXzz037jgobSGvP1oix6EzSVurYV1ausNt3I4-2BYKaMQdmh8e4d6xbWIRnF6k24Q92OjEBajtDxgskymp8nB6MEJsQKZmeF8EGEf5oc63BxA-3D-3D>
        for more information, including invoices (where available).
        xide9380be9-543e-5185-a7f0-11c29d85296a
        pGvlI2ANUbXFfyEOgxta1RMV082993
        Switch payment method >
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UtZFQ7pIOjmZcmDi74LjDr9eLjI6uUw9XshXxoZpSQHpPfRyxNn5yn-2Fb1KF-2FxvsbA9gVmJaPBVOQZPblvS9-2Bq1c17MZy0utkdscLhreltB906mPfa94bY6pBaPXmXr5vYg-3D-3DlYD__tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj1BFF9VS-2Bx4uPW0Y8NRN-2FkMkFfnnSUi9ApwCUsfhbABpM8I1lkGWMm6YT4Y3dM1WcVjzuvjuOgat73YGsBFIPowYN-2F8ON0tUXES5pud-2F5GGoNxLPODyatzBBEbn6bQaLqmdgxWMOSAoyxh1LxC-2Fcq-2BrA2tJ2MJ0pIXtE2s-2ByMRs8qSs3smxyzsgECoFfC49iCg-3D-3D>

        You ordered from McDonald's® - Ursynów
        Delivered to
        Testowa 1, 00-000 Warszawa, Poland

        [image: Restaurant Image]
        Delivered by Maksym

        Contact support ❯
        <https://email.uber.com/ls/click?upn=kJhnexMsgLylOpTlsTU59clmS0l1ennUtyA6mQBL84ZTuCvJFeMQlwYWbI6EA15wlyC5_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj6ZcpF0anepTlMgbONKLfrrT17J65h4Dtl1mOCzTU6HUGtUjyCDR5KT-2BX-2F4n-2FHxzequxfMXqWkJVDv34GvRzzu86X68nCA5fakqrAVr-2F0L1wXz13YYLSzco7KN7DAkgnMlL73JSo6cClRnBsncNjSw-2BHNw86M62WMAaaw0TUhl9jRLvNTyL00WkFYK0li1H7sA-3D-3D>
        Contact support ❯
        <https://email.uber.com/ls/click?upn=kJhnexMsgLylOpTlsTU59clmS0l1ennUtyA6mQBL84ZTuCvJFeMQlwYWbI6EA15wWon__tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGjwE-2BF29I3NhWgw1mJYJ1nG-2F06itf5miUP-2Bfvi-2FiX2F9d5VnTzE-2BeNY8bEs4sxzeXS4WqC-2B-2F3xXALjfga8EBoHByMN5c8dDQkfwUv646TOQyJxqms-2BniG7e-2Bx4VP8T7fqfn6IkY-2FV0wLJWKknheOKkdAXavvZfs-2FNX7d7AUZzHXbWSgnEx3v7L89dLRgv0KQh0Q-3D-3D>

        My orders ❯
        <https://email.uber.com/ls/click?upn=wMeu9voMhemh7JDXdZkLkyJJleQ46FQp8FnUMvbYwo8Qq2hiRz0FRoGTJlOGP6nfOz08_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj62HoHAz3YWZCpAC6VVcTgKNWv3Xj2wKGoRx2QAExWvqV4mAPAKrTF7FiHWxH-2BDgj-2Fh9GDpVmvcMGYiAXtdgy037Fb-2FtRQwY0CyaR6cUO8XHNPJG1Ly4VXwE6QrD4BYErCvwWJgtFOMpWloMX-2BW9KGYwAzbxuQL5f2CLA7guIbZ3CC0SnYnyCJYtjQt6Jasv2w-3D-3D>



        Forgotten password
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UtZFQ7pIOjmZcmDi74LjDr-2BptOSL-2Fgr4MR6m7bhpRYok62Al0Niw3aJ7vkGWRa5RegA9IE90Hhvph3D40APM-2BmT-2F1x-2FrNLEb9JqT1AUlNkpCy85oVZo-2Fsd0PQIF-2Boo-2BiTQ-3D-3DIlQd_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGj1FI5yhoQoIvxbBdjIivjuZImiXsSEz0BdQ-2FaF5FHAU0rOVcBunnOlkisfLfgSY3XaNwNDPF6zCA3DNpZvlXpSxz5J1XxT8UeQFBz0waD2qC13N-2FJ3chwoammvr5Ma0d1pfq2M2GovebYy99KaOgm8AvmEVp18p-2BbLLyo-2B-2Facr6kdsXDU-2FfoE26Dnc9DOk8EGA-3D-3D>
        Privacy
        <https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzDKq5PxwjJLnlhd3kWpjkC8D59v_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGjy-2F-2FpTBlswSFIyjgqa05EmdM3iaZAhtAFY54-2FZlLznHF32GYFiYYpVM7vmLhJGO-2BjeD1lw5tK7BC9twkFCyBGCEYDzRosx5rXmfDI5nPpXfNUKdsE20TjID7f4t4IUl6GnoKWuCwF0arxET2P-2BNSAilpvL8Sx6v-2BImwfMANyVAdx0tkSHeDiY8fm-2FS-2BVL9G5Uw-3D-3D>
        Terms
        <https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzD9L-2F1tKRCOuyZn2F4t4pFG1jWG_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W0Lf-2F5gqcKvAzcCXg3xbO8MdIi0GrJYArqx-2BvSYq7b5eor8i-2Blh472u6fWFcoy1vfHseCwfJH7eFUCg32f50zPf0edqSBANGKsdakbmTyARxisY5QcFhbe0k9ovjXj5QnqGbUUNwejuM1p9GQ4P0ISMFsx-2FvTmNNcajaaisA-2Ff9VK7Z6rjrMVPxy72QERtUpsFAhx7ZMRRVa8CmNiXRKujfyqyzwRFm7b4njztAYHy927DPy6R6qfSAE8Rguehr4gtPKM2iHBo27SERm-2B61pmTQwpVQOqTjU9S4RWq2xXMGjxpQ5kxGf1Jvbb0YfR6EsAQFSbgpu2bMgqx6AmsodCe-2FdGRYhLtdIUhI3-2BP4hIsDpaGFc92cQ8xdBomzLoi8GKEkmTFU7aUtlmFBuxuZWn7Gpehv2YrBPsFpXl-2FbBq4JtK-2BVrQqTQzlbfjozw94xNet8MzxzhTPkv513HbhqjCi2FozQURLZHu19Erxmmn5djg-3D-3D>
        Uber Eats Poland Sp. z o.o.
        Poland, Warsaw, ul. Inflancka 4, 00-189
      `;

      expect(getPayee(messageText)).toStrictEqual("Uber Eats");
    });
  });

  describe("getTransaction", () => {
    it("reads transaction with abbreviated memo", async () => {
      const messageText = `
        ---------- Forwarded message --------- 
        From: Bolt Food <poland-food@bolt.eu> 
        Date: Mon, 8 Aug 2022 at 12:58 
        Subject: Delivery from Bolt Food 
        To: <example@example.com> 
        
        
        ­08.08.2022 
        
        
        *Bon Appetit, John!* 
        
        This is your receipt. 
        From Salad Story - Al. KEN ­Aleja Komisji Edukacji Narodowej 24/U-2 02-797 
        Warszawa 
        To ­Example Street 4/20, Warszawa, Polska 
        
        1 × Mango Salmon Salad XL Sezam 
        
        37.99 ZŁ 
        
        Delivery fee 
        
        2.49 ZŁ 
        
        *Total charged:* 
        
        *40.48 ZŁ* 
        
        •••• 0000 
        
        Download cost document Delivery 
        <https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=00000000-0000-0000-0000-000000000000&l=gb&c=pl> 
        If you require an invoice for Food, please request it from the Seller. 
        Bolt Operations OÜ
      `;

      const transaction: Transaction = {
        date: parseISO("2022-08-08"),
        amount: 40.48,
        memo: "Salad Story",
        payee: "Bolt Food",
      };

      expect(transactionService.getTransaction(messageText)).toStrictEqual(
        transaction
      );
    });
  });
});
