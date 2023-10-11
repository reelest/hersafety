import { memo, useId, useRef, useState } from "react";
import ModelTable from "../ModelTable";
import Prescriptions, {
  DrugDetails,
  Prescription,
} from "@/models/prescription";
import ModelFormRefField from "../ModelFormRefField";
import ModelForm from "../ModelForm";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import useQueryState from "@/utils/useQueryState";
import Table, {
  addClassToColumns,
  addHeaderClass,
  supplyHeader,
  supplyValue,
} from "../Table";
import useUserData, { mapRoleToUserModel } from "@/logic/user_data";
import { supplyModelValues } from "../ModelDataView";
import usePromise from "@/utils/usePromise";
import Clients from "@/models/client";
import { useUpdate } from "react-use";
import { Printer } from "iconsax-react";
import printElement from "@/utils/printElement";

export default function PrescriptionsPage() {
  const [activeUser, setActiveUser] = useQueryState("user", null);
  /** @type {[Prescription, import("react").SetStateAction<Prescription>]} */
  const [modalOpen, showReceipt] = useState(null);
  const clientId = activeUser;

  return (
    <div>
      <Box
        sx={{ height: clientId ? 0 : "15vh", transition: "height 0.6s" }}
      ></Box>
      <ModelForm
        initialValue={{ user: activeUser }}
        onChange={({ user }) => {
          setActiveUser(user);
        }}
        meta={{ user: Prescriptions.Meta.user }}
        className="p-4 flex justify-center"
      >
        <ModelFormRefField
          name="user"
          label="Select Client"
          meta={Prescriptions.Meta.user}
          sx={{ minWidth: "20rem" }}
        />
      </ModelForm>
      <PrescriptionReceipt
        prescription={modalOpen}
        setPrescription={showReceipt}
        clientId={clientId}
      />{" "}
      {clientId ? (
        <ModelTable
          Model={Prescriptions}
          props={["date", "drugs", "price", "status"]}
          enablePrint
          onClickRow={(prescription) => showReceipt(prescription)}
          onCreate={() => {
            if (!clientId) return false;
            const item = Prescriptions.create();
            item.user = clientId;
            return item;
          }}
          deps={[clientId]}
          Query={clientId && Prescriptions.withFilter("user", "==", clientId)}
        />
      ) : (
        <div className="flex justify-center items-center min-h-[50vh] p-6">
          <Typography
            color="text.disabled"
            sx={{ fontSize: "1.5rem", opacity: 0.5 }}
          >
            View and modify client prescriptions.
          </Typography>
        </div>
      )}
    </div>
  );
}

const PrescriptionReceipt = memo(function PrescriptionReceipt({
  prescription,
  setPrescription,
  clientId,
}) {
  const ref = useRef();
  const userData = useUserData();
  const userRole = userData?.getRole?.();
  const userId = userData?.id?.();
  const user = usePromise(
    () => clientId && Clients.preview(clientId),
    [clientId]
  );
  const update = useUpdate();
  const drugDetails = usePromise(
    () =>
      prescription &&
      Promise.all(prescription.drugs.map((e) => DrugDetails.preview(e))),
    [prescription?.drugs?.join?.(",")]
  );
  return (
    <Modal
      open={!!prescription}
      onClose={() => setPrescription(null)}
      className="flex justify-center items-center"
    >
      <Paper
        ref={ref}
        className="relative max-w-xl w-96 mx-auto print:w-full pt-8 px-8 max-sm:px-4 pb-4 max-h-[90vh] overflow-scroll"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Drug Prescription issued to {user?.getName()}
        </Typography>
        <Stamp
          color="black"
          text="ORIGINAL"
          className="absolute top-1/2 left-1/2 opacity-10 hidden print:block"
          style={{
            width: "35em",
            height: "35em",
            transform: "translateX(-50%) translateY(-50%)",
          }}
        />
        <div className="relative z-10">
          <Table
            key={prescription?.paid}
            rows={6}
            cols={2}
            data={[prescription]}
            renderHooks={[
              supplyHeader(() => ""),
              // This is a confusing way to use supplyModelValues in a Receipt
              ({ row, col, next }) => next({ row: col - 1, col: row }),
              supplyModelValues([
                "date",
                "price",
                "status",
                "timeOfPayment",
                "paymentMethod",
                "ref",
              ]),
              supplyHeader(
                (col) =>
                  [
                    "Date",
                    "Price",
                    "Status",
                    "Time of Payment",
                    "Payment Method",
                    "Ref",
                  ][col]
              ),
              supplyValue((row, col, e) =>
                row === 0 && col === 5 ? prescription.id() : e
              ),

              addClassToColumns("text-sm", [5]),
              ({ row, col, next }) => next({ row: col, col: row + 1 }),
              addClassToColumns("font-bold pr-2 py-2", [0]),
            ]}
          />
          {drugDetails ? (
            <Table
              data={drugDetails}
              className="text-sm w-full mt-4"
              rows={drugDetails.length}
              cols={userRole === "admin" ? 5 : 4}
              headers={["Drug", "Amount", "Unit Price", "Price", "In Stock"]}
              renderHooks={[
                supplyModelValues([
                  "drug",
                  "amount",
                  "unitPrice",
                  "price",
                  "inStock",
                ]),
                ({ attrs, classes, next, col }) =>
                  next({
                    classes:
                      col === 4 ? classes.concat("print:hidden") : classes,
                    attrs: {
                      ...attrs,
                      style: {
                        ...(attrs.style || {}),
                        width: col === 0 ? "20%" : "10%",
                        border: "2px solid grey",
                      },
                    },
                  }),
                addHeaderClass("px-1 text-center"),
                addClassToColumns("px-1"),
                addClassToColumns("font-bold py-2", [0]),
                addClassToColumns("break-all"),
              ]}
            />
          ) : null}
          {prescription ? (
            prescription.paid ? (
              <Stamp color="green" text="paid" />
            ) : userRole === "admin" ? (
              <>
                <div className="print:hidden">
                  {}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={async () => {
                      await prescription.acceptPayment(userId);
                      update();
                    }}
                    sx={{ mx: "auto", display: "block", mt: 8, mb: 4 }}
                  >
                    Validate payment
                  </Button>
                </div>
                <Stamp
                  color="#cd9a00"
                  text="unpaid"
                  className="hidden print:block"
                />
              </>
            ) : (
              <Stamp color="#cd9a00" text="unpaid" />
            )
          ) : null}
          <div className="print:hidden text-center">
            <Button onClick={() => ref.current && printElement(ref.current)}>
              Print <Printer />
            </Button>
          </div>
        </div>
      </Paper>
    </Modal>
  );
});

const HEADER_1 = "Micheal Okpara University Of Agriculture";
const HEADER_2 = "Umudike";
function Stamp({
  color = "purple",
  className,
  text = "seen",
  style,
  ...props
}) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 200 200"
      {...props}
      className={"block " + className}
      style={{
        width: "280px",
        height: "280px",
        margin: "auto",
        ...style,
      }}
    >
      <defs>
        <filter
          id={id}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.173"
            numOctaves="4"
            seed="15"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feSpecularLighting
            surfaceScale="12"
            specularConstant="1.6"
            specularExponent="20"
            lightingColor="#ffffff"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            result="specularLighting"
          >
            <feDistantLight azimuth="3" elevation="186"></feDistantLight>
          </feSpecularLighting>
        </filter>
      </defs>
      <circle
        stroke={color}
        strokeWidth={3}
        fill="none"
        cx={100}
        cy={100}
        r={80}
      ></circle>
      <circle
        stroke={color}
        strokeWidth={3}
        fill="none"
        cx={100}
        cy={100}
        r={55}
      ></circle>
      <path
        id="top-sector"
        fill="none"
        d="M32.5,100a67.5,67.5 0, 1,1 135,0a67.5,67.5 0, 1,1 -135,0"
      />
      <text
        fontSize={14}
        style={{
          textTransform: "uppercase",
          fill: color,
          fontFamily: "monospace",
        }}
        transform="rotate(-39.5 100 100)"
        dominantBaseline="central"
      >
        <textPath xlinkHref="#top-sector">{HEADER_1}</textPath>
      </text>
      <path
        id="bottom-sector"
        fill="none"
        d="M32.5,100a67.5,67.5 0, 1,0 135,0"
      />

      <text
        fontSize={14}
        style={{
          textTransform: "uppercase",
          fill: color,
          fontFamily: "monospace",
        }}
        transform="rotate(-67.5 100 100)"
        dominantBaseline="central"
      >
        <textPath xlinkHref="#bottom-sector">{HEADER_2}</textPath>
      </text>
      <text
        x={100}
        y={100}
        fontSize={text?.length > 7 ? 20 : 28}
        style={{
          textTransform: "uppercase",
          fill: color,
          fontFamily: "monospace",
        }}
        transform="rotate(-17.5 100 100)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {text}
      </text>
      <rect
        width="200"
        height="200"
        fill="#ffffff"
        filter={`url(#${id})`}
      ></rect>
    </svg>
  );
}
