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

    it("reads Uber payee", () => {
      const messageText = `
        ---------- Forwarded message ---------
        From: Uber Receipts <noreply@uber.com>
        Date: Sun, 10 Jul 2022 at 02:17
        Subject: Your Sunday morning trip with Uber
        To: <example@example.com>
        
        
        
        
        
        Total PLN 44.59
        10 July 2022
        
        
        
        Thanks for riding, John
        We hope you enjoyed your ride this morning.
        
        Total PLN 44.59
        
        Trip fare PLN 44.05
        
        Subtotal PLN 44.05
        Wait Time
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzlDzoIe4eyE-2BGu7Ngh4JAV5Mj4mFsJc3CE7GOiXQye5ZEWBbH-2FUz1nJCwoijOMiTcM0xHgvi1kjT5A65ukv4EKjkgvfsKsXf-2BjRbK-2FA1cQ6A-3D-3DtA2b_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzs9WT4QSZ9q7FdvrOkLdbxycLofw0o7UsqRAuAncT-2FzWNKNzqa6c19KTKXmVdBoQ8Rj92rj4rGdfySxyEKRELOPCrqDtUWz-2Fx3qp7iYHRH-2BWiFTNRZpyecRMfg-2Fi-2Fr44gYUj1ajoQHSlRQPtbv6XcYFD8-2BGW6yaTXRLOSYVLsnGkUXYrQsE-2BlHTKCbI8QuNUTA-3D-3D>
        PLN 0.54
        
        Payments
        Apple Pay Mastercard ••••0000
        10/07/2022 02:17 PLN 44.59
        A temporary hold of PLN 44.05 was placed on your payment method Apple Pay
        Mastercard ••••0000. This is not a charge and will be removed. It should
        disappear from your bank statement shortly. Learn more
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzQRKXk-2BkHC8JHXsmguglHRmkzqEQBpgKmsFOo24-2BWx5RYrz6jjPTLwjpvvckelD1q0-2F2t13PPAIieAQo5oNfk5LDvgl5pjzXj2mbzyFvSoemTIukS1M6dVMvi2V9EfBKFibKBzFWS6mY-2Fju5mJwLBEBs18_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzopMGmOLPLTQa-2B4U8NM8TDgxyQ-2F8USIesxM3BLItA1h43VUfbVZ64P23mmLf-2BszyvGXe3lFic1iRxxKDXmwKSocsavNGsbB5QzB5nU8T1bDfNfxvdDdhCTamdKqLbu40qGkHpXRM65A1JeD5UAG-2BzXAQyIUrX5-2BWFnV-2ButMk3qrSF4AmABZo7oyKyvT3FW1-2FIg-3D-3D>
        Visit the trip page
        <https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3Dtg8q_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYziPbKfk6m-2BYtWSfEdqFD-2FJ-2BBvJ2c4pZC2S3PQBJdRAWWFaqO1YQ-2BG21X-2FBk3-2B0ghgRsVYb7SD5QX0GGSXKF-2F8j0JOUTrvkOrQiS5nTZ0Yn-2BLXa5rv3oz-2B1W1uJgj764tJl7Raud3WaP9LvPgc-2FOTyi5HBJ4X8oo9-2BEDZjLdW-2FIeIVxlaJJXW9bPR-2FXdUmDTZoQ-3D-3D>
        for more information, including invoices (where available)
        Download eReceipt as PDF
        <https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJtykrQb5QgsPS2RILy-2BM1jmDu2AzWQjOhi7StWcCeFwTQ-3D-3DtCyy_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzg3hDM5YOTDUcNkT6QtAwgOIrZrD30C5p86Y6ejoG9mEhdy7MVzDAh7-2FqbcSGNm6Mfgkg1Gedfzb5kYNHWfrmfL9Jofueibtwm0IrVSTNWWR2uHdyuVZZcIqAdQwFKXTK4B0XRvnUwPtAkePoXgxMxZ1HYLu9VOdBJ-2Bd-2FDDlU0kHKC0FSwCTrjOCcuiFDOebgw-3D-3D>
        Download eReceipt as JWS
        <https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJsqmmLqff7SAc2l41QpXDACQrAlm7sr3WBJaBV9iM2d2Q-3D-3DIDo-_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzubP8NbeDD-2BLNXim-2FzpftGlQ3QduQ7tW2nAY5DnBfcAYvjcqyBZyG4s1t-2BFFA9oIEeQY6UJq6W9h-2B5GEUAb5W9oQte9SgxAoKGXtx1G3XI6aApcmx2nqr0kO6BC9qt8Nqlqxd1XMg6LO5cTugK0-2BQfyCciNDpG6esTCwXpfKhJlIEy6DCQAGHTrhmvsu-2BOzqJQ-3D-3D>
        
        You rode with Dmytro
        4.89 Rating
        
        Rate or tip
        <https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3DK94l_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzuje5bfcdqW2eqNPmuxt7PKi8QL0nH4c8rmRyNNSpFV6sLPcYf9W1NUldcM-2BnbaG7JJ-2BYiSCweZmBW9AahX197ek1OVAjZBfAL57Ng9x55XlvPUgDGoD4TmuJbMlmDifEb-2BGyR2Q6eOCGhHYKbTHQnB9pcAH3hFOL4Dx7xCNpnmhx71Lgbn-2FmjXBZUjagbCSHw-3D-3D>
        This is not a tax invoice. This is a payment receipt for the transportation
        service provided by INREDUSE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.
        
        
        UberX
        17.04 kilometres | 20 min(s)
        01:56
        Testowa 1, 00-000 Warszawa, Poland
        02:17
        Przykładowa 1, 00-000 Warszawa, Poland
        
        Report lost item ❯
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15Uvsoaok85PvqCQ3QlNb6arQAsUWbSTnikFU6vUxSTt8vgm7RDagOhr04y1Xv44afdKpcqaLlJ3iJEcDlphulsDM-3DJekm_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzut8JqtCH9UYigMcKT7iteCOX2LwAfbNwN10HzWhMyms8fG0KFv6B7cdNvPAOJyikrv3MyCNBHLhnpYSLJ3gilipjsZxpf2q1GfQR8CQqDEeO3mLCPIFZHFWkqaT4j-2F2EqDZKf-2F2OEQrqwcL10pVbytk5nkw1nT730qJmIqiQOJG4CUhz80hwVtx73g7FzOnSg-3D-3D>
        
        
        Contact support❯
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjnU1u7fTMJxOJIS1zPN1gI-3D-QjG_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzmerI8F8IjqXzeR6jkYY2PvlL-2FSaL0CB3lAlRR4WfEno3uyXsX0ecaREB7h7EoxFJ1zFSKTXOiLjaLAyFZ5rc6w3x-2BeDE3OZIA20Sv1o2cOWVjHyTARjTZtEQNUgesXtoxtdUtueArQ3a21yXNy1nODG2LSNLU95BUyFhaWFKkPJ8C3v6dclDMHWxBQMK50lAQ-3D-3D>
        
        My trips ❯
        <https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRshoZOO-2FR78Vytc-2FQoAWi93PfYS_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzovfEDe2FRLdoZ3zLs1-2ByIT7Xn59nRK-2FjH5cbyacxVtjbiHvpP3svQPcyRksN2wR6zRJRXfkoZdQ-2FZFDTHczEPApHKclC5WUOI8LWOUCdSLfpzZ9hrwSXQLTeBctRDwCeOjX39TM0KQTJNWSknA7jZBhfdSdNdXUs-2Fux4lLGUYVeVptEX-2FIfV6M-2Bq1bimXXoEA-3D-3D>
        
        
        
        Forgotten password
        <https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UiEU1Z05tLORYDhCMvHDxMXp1-2FGrvQPqpo9EFNFs3mqmwnK9G-2F3FherPjzsICj7yM-2FK-2FJYue6uKR2EHeIe26RLwpFTiSq-2BB-2FMOIwXA4MEf4KzHSrwM9QQbMHeXFgqFXItep-2Bp1Kf9guqlEKa1wFayRA3nSyhHdpw0M5nDUB4Sy-2FJsESM7ZfaBkdKepvt8RTcsw-3D-3DA5YV_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzr5Y6CjV1jhBuz3dixT4ULvOcxVqtSY-2BHKgHpjce-2Ftt5V2PiCX6ciK9uWvbWPNLRkN7GKLvi3RyBNIdEyRoagEZcZjnVrotEScVtGt8NMg97nAmtS7VCAssrNyusKQZBhSDCBo4vUBTgm3ClpOYbrwSSJQuDO4cpk4hX3be7PAakwy2OhF4CDEpED4UCcBGXeA-3D-3D>
        Privacy
        <https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzDKq5PxwjJLnlhd3kWpjkC8zbzr_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrS16eFBPrSuvEjiLKVbX7A0RoTdHhJwdCk2AmIBKR3oBXtUAfGhrYz1-2Fioyot55xXe3Xs3BGZJlgkXG6Fg0nUEnzT8Mun6-2FlEb2b-2BigC0-2Bs0RIlpSnIKjGrWwBzImYi7fceKwLz-2B9muSKCMHoV30OXIQGgsCFZCB1ueoNrVKzUqgezacElaGj2FR4VrHnyqVQ-3D-3D>
        Terms
        <https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzD9L-2F1tKRCOuyZn2F4t4pFGWOJ8_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrr7Reuq34a24q4OH9MRBtB0E-2FZbM0laKOiHBEV2B-2BFXVNKs62P2Fm5Q9AEQezzRdyheBSL7McmH2xtP81bsal-2B9w3b-2BZaw14LHI0Yp2wzsf84Xu7sj4aFFRhVwQ7MFxbL-2F6dZM4CYZ1qhoCin-2BQX8NshnmCxdhYJkxF2OfZrzqDiahEP3WC5RtQu29wMEvX-2Bw-3D-3D>
        Uber Poland sp. z o.o.
        ul. Inflancka 4, 00-189 Warszawa
        
        Fare does not include fees that may be charged by your bank. Please contact
        your bank directly for inquiries.
      `;

      expect(getPayee(messageText)).toStrictEqual("Uber");
    });

    it("reads UPC payee", () => {
      const messageText = `
        ---------- Forwarded message ---------
        From: BM <no-reply@bm.pl>
        Date: Wed, 12 Oct 2022 at 10:20
        Subject: Płatność automatyczna dla UPC Polska Sp. z o.o. została
        zrealizowana
        To: <example@example.com>




        Data transakcji: 2022-10-12 10:20:25

        Nr transakcji: ABC123456789



        Potwierdzenie wysłania przelewu automatycznego


        Odbiorca płatności:
        UPC Polska Sp. z o.o.

        *Numer konta:*

        00000000000000000000000000

        *Tytuł przelewu:*

        Opłata miesięczna

        *Kwota:*
        59.99 PLN

        Prowizja:
        1.00 PLN

        Łączna kwota:
        60.99 PLN

        Identyfikator zamówienia
        ABC123456789







        Informujemy, że czas zaksięgowania przelewu na rachunku bankowym odbiorcy
        jest uzależniony od działania wewnętrznego systemu bankowości
        elektronicznej w banku odbiorcy. Dokładamy wszelkich starań, aby przelewy
        były realizowane w możliwie najkrótszym czasie.

        Pozdrawiamy,
        Zespół Blue Media

        Centrum Pomocy
        Blue Media

        od poniedziałku do piątku od 7:00 do 22:00, w soboty od 8:00 do 16:00
        58 7604 844
        <587604844> - połączenie płatne zgodnie z taryfą operatora. Całodobowo
        zapraszamy też do kontaktu poprzez formularz online
        <https://pomoc.bluemedia.pl>.

        Wiadomość wysłana na podstawie art. 24 Ustawy z dnia 19 sierpnia 2011 r. o
        usługach płatniczych z późn. zm. przez Blue Media S.A. z siedzibą w
        Sopocie, ul. Powstańców Warszawy 6, 81-718 Sopot, zarejestrowaną w Sądzie
        Rejonowym Gdańsk-Północ, VIII Wydział Gospodarczy KRS pod nr 0000320590,
        NIP 585-13-51-185, REGON 191781561, kapitał zakładowy 2 205 500 PLN
        (wpłacony w całości), nadzorowaną przez Komisję Nadzoru Finansowego i
        wpisaną do rejestru krajowych instytucji płatniczych pod numerem IP17/2013.
        Administratorem danych osobowych niezbędnych w procesie płatności jest Blue
        Media S.A. ul. Powstańców Warszawy 6, 81-718 Sopot. Dane osobowe
        przetwarzane są w celu realizacji płatności oraz wypełnienia obowiązków
        wynikających z przepisów prawa (ustawy z dnia 19.08.2011r. o usługach
        płatniczych, ustawy z dnia 16.11.2000 r. o przeciwdziałaniu praniu
        pieniędzy i finansowaniu terroryzmu). Niektóre dane zostały udostępnione
        przez odbiorcę płatności i w odniesieniu do tych danych płatnik ma prawo
        sprzeciwu co do ich przetwarzania. Podanie danych osobowych jest
        dobrowolne, ale niezbędne do realizacji płatności. Płatnikowi przysługuje
        prawo dostępu do treści przetwarzanych danych osobowych oraz prawo ich
        poprawiania.
        Jeśli nie jest Pani/Pan zamierzonym adresatem niniejszej wiadomości,
        prosimy o poinformowanie nas o tym oraz usunięcie wiadomości bez otwierania
        załączników.
      `;

      expect(getPayee(messageText)).toStrictEqual("UPC");
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
