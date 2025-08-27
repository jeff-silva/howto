<template>
  <div>
    <h2>OFX</h2>
    <v-btn
      text="Abrir"
      @click="folder.browse()"
    />
    <br />

    <template v-for="acc in bank.accounts">
      <br />
      <v-card :title="acc.from.ACCTID">
        <v-data-table
          fixed-header
          :headers="[
            { key: 'TRNTYPE', title: 'Tipo', width: 100 },
            { key: 'TRNAMT', title: 'Valor', width: 100 },
            { key: 'MEMO', title: 'Memo' },
            { key: 'DTPOSTED', title: 'Data/Hora', width: 200 },
          ]"
          :items="acc.transactions"
        ></v-data-table>
      </v-card>
    </template>

    <!-- <pre>{{ bank }}</pre> -->
    <!-- <pre>{{ folder }}</pre> -->
  </div>
</template>

<script setup>
import ofx from "node-ofx-parser";
import { useDate } from "vuetify";

const date = useDate();

const bank = reactive({
  accounts: [
    // {
    //   from: {
    //     BANKID: "0260",
    //     BRANCHID: "1",
    //     ACCTID: "19861616-2",
    //     ACCTTYPE: "CHECKING",
    //   },
    //   transactions: [
    //     {
    //       TRNTYPE: "DEBIT",
    //       DTPOSTED: "20250601000000[-3:BRT]",
    //       TRNAMT: -16.98,
    //       FITID: "683cba23-99ce-4846-9891-735f2661f7ef",
    //       MEMO: "Compra no débito - Uber UBER *TRIP HELP.U",
    //     },
    //     {
    //       TRNTYPE: "DEBIT",
    //       DTPOSTED: "20250601000000[-3:BRT]",
    //       TRNAMT: -128.4,
    //       FITID: "683cc154-cabd-44a2-a617-70a05b63cea6",
    //       MEMO: "Compra no débito - SUPERMERCADO KARAJAS",
    //     },
    //     {
    //       TRNTYPE: "DEBIT",
    //       DTPOSTED: "20250601000000[-3:BRT]",
    //       TRNAMT: -13.91,
    //       FITID: "683cc533-33d9-4d1a-8c26-3186047cdcde",
    //       MEMO: "Compra no débito - Uber UBER *TRIP HELP.U",
    //     },
    //     {
    //       TRNTYPE: "DEBIT",
    //       DTPOSTED: "20250602000000[-3:BRT]",
    //       TRNAMT: -79.18,
    //       FITID: "683e1b0f-7edf-44b5-a101-6e338aa105b4",
    //       MEMO: "Compra no débito - COMERCIO DE ALIMENTOS",
    //     },
    //   ],
    // },
  ],
  validate() {
    bank.accounts.map((acc) => {
      acc.transactions.map((trans) => {
        trans.TRNAMT = parseFloat(trans.TRNAMT);
        trans.DTPOSTED = new Date(
          [
            [
              trans.DTPOSTED.substring(0, 4),
              trans.DTPOSTED.substring(4, 6),
              trans.DTPOSTED.substring(6, 8),
            ].join("-"),
            [
              trans.DTPOSTED.substring(8, 10),
              trans.DTPOSTED.substring(10, 12),
              trans.DTPOSTED.substring(12, 14),
            ].join(":"),
          ].join(" ")
        );
      });
    });
  },
});

bank.validate();

const folder = reactive({
  files: [],
  handle: null,
  async browse() {
    console.clear();
    folder.handle = await window.showDirectoryPicker();
    const perm = await folder.handle.requestPermission({ mode: "readwrite" });
    if (perm != "granted") return;
    await folder.init();
  },
  async init() {
    folder.files = [];

    const recursiveHandler = async (parentHandle, dir = "/", items = []) => {
      for await (const [name, handle] of parentHandle.entries()) {
        if (!dir.startsWith("/")) dir = `/${dir}`;
        const full = `${dir}/${name}`;
        items.push({ name, dir, full, handle });
        if (handle.kind === "directory") {
          items = await recursiveHandler(handle, name, items);
        }
      }

      return items;
    };

    folder.files = await recursiveHandler(folder.handle);
    const accounts = {};

    await Promise.all(
      folder.files.map(async (item) => {
        if (item.handle.kind == "file") {
          const ext = item.name.split(".").pop().toLowerCase();
          if (ext == "ofx") {
            const file = await item.handle.getFile();
            let content = await file.text();
            content = await ofx.parse(content);

            if (
              typeof accounts[
                content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID
              ] == "undefined"
            ) {
              accounts[
                content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID
              ] = {
                from: content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM,
                transactions: [],
              };
            }

            const account =
              accounts[
                content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTID
              ];

            const transactions = Array.isArray(
              content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
            )
              ? content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN
              : [
                  content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST
                    .STMTTRN,
                ];

            transactions.map((trans) => {
              account.transactions.push(trans);
            });
          }
        }
      })
    );

    bank.accounts = Object.values(accounts);
    bank.validate();
  },
});
</script>
