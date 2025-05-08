import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { selectCurrentModules } from "./services/state/authSlice";

import { RequireAuth } from "./components";

import Order from "./pages/Order";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventGroup from "./pages/EventGroup";
import GeneralSetting from "./pages/GeneralSetting";
import UnderConstruction from "./pages/UnderConstruction";
import UserRole from "./pages/UserRole";
import UserData from "./pages/UserData";
import OthersAppSetting from "./pages/OthersAppSetting";
import CustomerData from "./pages/CustomerData";
import ModifyTopUp from "./pages/ModifyTopUp";
import WalletBenefitsCode from "./pages/WalletBenefitsCode";
import ApprovalWalletBenefits from "./pages/ApprovalWalletBenefits";
import ServiceRequest from "./pages/ServiceRequest";
import ServiceEventChecking from "./pages/ServiceEventChecking";
import ServiceAddModify from "./pages/ServiceAddModify";
import ServiceManageRequest from "./pages/ServiceManageRequest";
import ApprovalVisibiltyService from "./pages/ApprovalVisibiltyService";
import PaymentCart from "./pages/PaymentCart";
import WalletServiceTransaction from "./pages/WalletServiceTransaction";
import ReportTransaction from "./pages/ReportTransaction";
import OthersEventType from "./pages/OthersEventType";
import ProfileSetting from "./pages/ProfileSetting";
import ClubData from "./pages/ClubData";
import EventRegisterOther from "./pages/EventRegisterOther";
import EventManageOther from "./pages/EventManageOther";
import EventResultOther from "./pages/EventResultOther";
import EventCreateEventGroup from "./pages/EventCreateEventGroup";
import EventManageRequestInvitation from "./pages/EventManageRequestInvitation";
import EventManageOwnEvent from "./pages/EventManageOwnEvent";
import EventManageRequirement from "./pages/EventManageRequirement";
import DonationDonateOthers from "./pages/DonationDonateOthers";
import DonationNewRequest from "./pages/DonationNewRequest";
import DonationManageMyDonation from "./pages/DonationManageMyDonation";
import EventResultOwnEvent from "./pages/EventResultOwnEvent";
import OthersAgeGroup from "./pages/OthersAgeGroup";
import OthersPool from "./pages/OthersPool";
import OthersEventMatch from "./pages/OthersEventMatch";
import OthersMainPosition from "./pages/OthersMainPosition";
import OthersOrganizationType from "./pages/OthersOrganizationType"; //! abhijit import
import CoinManagement from "./pages/CoinManagement";
import SponsorMaster from "./pages/SponsorMaster";
import News from "./pages/News";
import NewReportDashboard from "./pages/NewReportDashboard";
//! abhijit chances
import OrganizationMainOrganization from "./pages/OrganizationMainOrganization";
import OrganizationRelatedOrganization from "./pages/OrganizationRelatedOrganization";
import OrganizationMembers from "./pages/OrganizationMembers";

function App() {
  const modules = useSelector(selectCurrentModules);
  const isPermission = modules ? modules : []; // needed

  const isNotProduction = import.meta.env.VITE_SERVER !== "production";

  const walletTransaction = modules?.find(
    (module) => module.rule_code === "wallet_transaction"
  );
  const approvalWalletBenefits = modules?.find(
    (module) => module.rule_code === "approval_wallet_benefit"
  );
  const approvalVisibiltyService = modules?.find(
    (module) => module.rule_code === "approval_visibility_service"
  );
  const requestOtherService = modules?.find(
    (module) => module.rule_code === "request_other_service"
  );
  const manageServiceRequest = modules?.find(
    (module) => module.rule_code === "manage_service_request"
  );
  const addModifyService = modules?.find(
    (module) => module.rule_code === "add_modify_service"
  );
  const eventChecking = modules?.find(
    (module) => module.rule_code === "event_checking"
  );

  const serviceTransaction = modules?.find(
    (module) => module.rule_code === "service_transaction"
  );

  const generalSetting = modules?.find(
    (module) => module.rule_code === "general_setting"
  );
  const walletAmount = modules?.find(
    (module) => module.rule_code === "wallet_amount"
  );
  const referral = modules?.find((module) => module.rule_code === "referral");
  const coinManagement = modules?.find(
    (module) => module.rule_code === "coin_management"
  );
  const order = modules?.find((module) => module.rule_code === "order");
  const teamMaster = modules?.find(
    (module) => module.rule_code === "team_master"
  );
  const userRole = modules?.find((module) => module.rule_code === "user_role");
  const userData = modules?.find((module) => module.rule_code === "user_data");
  const customerData = modules?.find(
    (module) => module.rule_code === "customer_data"
  );
  const org = modules?.find((module) => module.rule_code === "org");
  const eventType = modules?.find(
    (module) => module.rule_code === "event_type"
  );
  const ageGroup = modules?.find((module) => module.rule_code === "age_group");
  const appSettings = modules?.find(
    (module) => module.rule_code === "app_settings"
  );
  const eventMatchCategory = modules?.find(
    (module) => module.rule_code === "event_match_category"
  );
  const eventMatchPool = modules?.find(
    (module) => module.rule_code === "event_match_pool"
  );
  const mainPosition = modules?.find(
    (module) => module.rule_code === "main_position"
  );
  const cart = modules?.find((module) => module.rule_code === "cart");
  const transaction = modules?.find(
    (module) => module.rule_code === "transaction"
  );
  const sponsor = modules?.find(
    (module) => module.rule_code === "sponsor_master"
  );

  const groupEvent = modules?.find(
    (module) => module.rule_code === "group_event"
  );

  const event = modules?.find((module) => module.rule_code === "event");

  const topup = modules?.find((module) => module.rule_code === "top_up");

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/event-master">
            {groupEvent?.can_menu && (
              <>
                <Route index element={<EventGroup />} />
                <Route path="event-group" element={<EventGroup />} />
              </>
            )}
            {event?.can_menu && <Route path="events" element={<Events />} />}
          </Route>
          {/* dev */}
          {isNotProduction && (
            <Route path="/event-management">
              <Route index element={<EventRegisterOther />} />

              <Route path="other-event">
                <Route path="register-other" element={<EventRegisterOther />} />
                <Route path="manage-other" element={<EventManageOther />} />
                <Route path="result-other" element={<EventResultOther />} />
              </Route>

              <Route path="my-own-event">
                <Route
                  path="create-event-group"
                  element={<EventCreateEventGroup />}
                />
                <Route
                  path="manage-request-invitation"
                  element={<EventManageRequestInvitation />}
                />
                <Route
                  path="manage-requirements"
                  element={<EventManageRequirement />}
                />
                <Route
                  path="manage-own-event"
                  element={<EventManageOwnEvent />}
                />
                <Route
                  path="result-of-own-event"
                  element={<EventResultOwnEvent />}
                />
              </Route>
            </Route>
          )}
          //! abhijit changes
          <Route path="/organization-management">
            <Route
              index
              path="main-organization"
              element={<OrganizationMainOrganization />}
            />
            <Route
              path="related-organization"
              element={<OrganizationRelatedOrganization />}
            />
            <Route path="members" element={<OrganizationMembers />} />
          </Route>
          {/* dev */}
          {isNotProduction && (
            <Route path="/donation-management">
              <Route index element={<DonationDonateOthers />} />
              <Route
                path="donate-to-others"
                element={<DonationDonateOthers />}
              />
              <Route path="my-donation">
                <Route
                  path="add-new-request"
                  element={<DonationNewRequest />}
                />

                <Route
                  path="manage-my-donation"
                  element={<DonationManageMyDonation />}
                />
              </Route>
            </Route>
          )}
          <Route path="/service-management">
            {requestOtherService?.can_menu && (
              <>
                <Route index element={<ServiceRequest />} />
                <Route
                  path="request-other-service"
                  element={<ServiceRequest />}
                />
              </>
            )}

            <Route path="my-services">
              {addModifyService?.can_menu && (
                <>
                  <Route index element={<ServiceAddModify />} />
                  <Route path="add-modify" element={<ServiceAddModify />} />
                </>
              )}

              {eventChecking?.can_menu && (
                <Route
                  path="event-checking"
                  element={<ServiceEventChecking />}
                />
              )}
              {manageServiceRequest?.can_menu && (
                <Route
                  path="manage-request"
                  element={<ServiceManageRequest />}
                />
              )}
            </Route>
          </Route>
          {/* dev */}
          {/* <Route path="/equipment-management">
            <Route index element={<EquipmentRequest />} />
            <Route path="request-equipment" element={<EquipmentRequest />} />

            <Route path="my-services">
              <Route index element={<EquipmentAddModify />} />
              <Route path="add-equipment" element={<EquipmentAddModify />} />
              <Route
                path="manage-request"
                element={<EquipmentManageRequest />}
              />
            </Route>
          </Route> */}
          <Route path="/cms-management">
            {userRole?.can_menu && (
              <>
                <Route index element={<UserRole />} />
                <Route path="user-role" element={<UserRole />} />
              </>
            )}

            {userData?.can_menu && (
              <Route path="user-data" element={<UserData />} />
            )}
          </Route>
          {cart?.can_menu && (
            <Route path="/payment-and-cart" element={<PaymentCart />} />
          )}
          <Route path="/wallet-management">
            <Route index element={<WalletServiceTransaction />} />

            {/* <Route path="topup" element={<Topup />} />
              <Route
                path="withdraw-wallet-to-bank"
                element={<WithdrawWallet />}
              />
              <Route path="change-wallet" element={<ChangeWallet />} /> */}
          </Route>
          {/* <Route path="/compensation">
            <Route index element={<UnderConstruction />} />
            <Route path="submenu-1" element={<UnderConstruction />} />
          </Route> */}
          <Route path="/approval-management">
            <Route index element={<ApprovalWalletBenefits />} />
            {approvalWalletBenefits?.can_menu && (
              <Route
                path="wallet-benefits"
                element={<ApprovalWalletBenefits />}
              />
            )}
            {approvalVisibiltyService?.can_menu && (
              <Route
                path="visibilty-service"
                element={<ApprovalVisibiltyService />}
              />
            )}

            {/* <Route path="visibilty-equipment" element={<UnderConstruction />} />
            <Route path="wallet" element={<UnderConstruction />} />
            <Route path="price" element={<UnderConstruction />} /> */}
          </Route>
          <Route path="/reports">
            <Route path="dashboard" element={<NewReportDashboard />} />
            {/* {isPermission[24]?.can_menu && (
              <Route
                path="wallet-benefits"
                element={<ApprovalWalletBenefits />}
              />
            )}
            {isPermission[6]?.can_menu && (
              <Route
                path="visibilty-service"
                element={<ApprovalVisibiltyService />}
              />
            )} */}
          </Route>
          <Route path="/commerce-setting">
            {generalSetting?.can_menu && (
              <>
                <Route index element={<GeneralSetting />} />
                <Route path="general" element={<GeneralSetting />} />
              </>
            )}

            {/* dev */}
            {/* <Route
              path="user-benefits-and-code"
              element={<UserBenefitsCode />}
            /> */}

            {referral?.can_menu && (
              <Route
                path="wallet-benefits-code"
                element={<WalletBenefitsCode />}
              />
            )}
            {walletAmount?.can_menu && (
              <Route path="modify-topup" element={<ModifyTopUp />} />
            )}
            {coinManagement?.can_menu && (
              <Route path="coin-management" element={<CoinManagement />} />
            )}
            {serviceTransaction?.can_menu && (
              <Route
                path="service-transaction"
                element={<WalletServiceTransaction />}
              />
            )}
          </Route>
          {customerData?.can_menu && (
            <Route path="/customer-management">
              <Route index element={<CustomerData />} />
              <Route path="customer-data" element={<CustomerData />} />
            </Route>
          )}
          {org?.can_menu && (
            <Route path="/club-management">
              <Route index element={<ClubData />} />
              <Route path="modify-club" element={<ClubData />} />
              {/* <Route path="approval-clubs" element={<ApprovalClub />} /> */}
            </Route>
          )}
          {sponsor?.can_menu && (
            <Route path="/sponsor-master" element={<SponsorMaster />} />
          )}
          {sponsor?.can_menu && <Route path="/news" element={<News />} />}
          //! abhijit changes
          <Route path="/others">
            {appSettings?.can_menu && (
              <>
                <Route index element={<OthersAppSetting />} />
                <Route path="app-setting" element={<OthersAppSetting />} />
              </>
            )}

            {eventType?.can_menu && (
              <Route path="event-type" element={<OthersEventType />} />
            )}
            {ageGroup?.can_menu && (
              <Route path="age-group" element={<OthersAgeGroup />} />
            )}

            {eventMatchPool?.can_menu && (
              <Route path="pool" element={<OthersPool />} />
            )}
            {eventMatchCategory?.can_menu && (
              <Route path="event-match" element={<OthersEventMatch />} />
            )}
            {mainPosition?.can_menu && (
              <Route path="main-position" element={<OthersMainPosition />} />
            )}
            {/* dev - abhijit changes */}
            {isPermission[45]?.can_menu && (
              <Route
                path="organization-type"
                element={<OthersOrganizationType />}
              />
            )}
            {/*
            <Route path="tool-type" element={<OthersToolType />} />
            <Route
              path="watermark-setting"
              element={<OthersWatermarkSetting />}
            /> */}
          </Route>
          {/* dev */}
          <Route path="/reports">
            <Route index element={<ReportTransaction />} />
            <Route path="transaction" element={<ReportTransaction />} />
            {/* <Route path="dashboard" element={<ReportDashboard />} /> */}
            {/* <Route path="users" element={<ReportUser />} /> */}
            {order?.can_menu && <Route path="order" element={<Order />} />}
          </Route>
          <Route path="/profile-setting" element={<ProfileSetting />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
