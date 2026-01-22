import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type RfpFormValues = {
  companyName: string;
  returnsPerYear: string;
  seasonality: string;
  sellsIntoRetailers: string;
  retailerProgram: string;
  currentReturnsHandling: string;
  returnsHandling: string;
  countries: string;
  warrantyProgram: string;
  warrantyInterest: string;
  subscriptionProgram: string;
  subscriptionInterest: string;
  salesSplitDtc: number;
  interestedChannels: string[];
  channelRestrictions: string;
  brandedDtc: string;
  brandedManagement: string;
  tradeIn: string;
  valuePriority: string;
  opportunityFeeling: string;
  excessInventoryChannel: string;
  excessInventoryNational: string;
  excessInventoryRegional: string;
  excessInventory: string;
  combineStrategy: string;
  name: string;
  email: string;
};


// Professional white background with black/deep navy text
const colors = {
  primary: "#0A0E27", // Deep navy
  bodyText: "#000000", // Black
  bodyTextAlt: "#0A0E27", // Deep navy
  muted: "#666666", // Gray for muted text
  border: "#334155",
};

const styles = StyleSheet.create({
  // Page styles
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.bodyText,
    backgroundColor: "#FFFFFF",
  },
  contentPage: {
    paddingTop: 80,
    paddingBottom: 70,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: "#FFFFFF",
  },

  // Cover page styles
  coverTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 15,
    lineHeight: 1.3,
  },
  coverLogo: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 30,
  },
  coverDate: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 25,
  },
  coverClient: {
    fontSize: 12,
    color: colors.bodyText,
    marginBottom: 30,
  },
  executiveSummary: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginTop: 20,
    textAlign: "justify",
  },
  coverFooter: {
    fontSize: 9,
    color: colors.muted,
    marginTop: "auto",
    paddingTop: 20,
    borderTop: `1pt solid ${colors.border}`,
  },

  // Header/Footer styles
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 15,
    paddingLeft: 50,
    paddingRight: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoText: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  confidentialFooter: {
    fontSize: 8,
    color: colors.bodyText,
  },

  // Section styles
  mainSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.bodyText,
    marginBottom: 16,
    marginTop: 8,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.bodyText,
    marginBottom: 12,
    marginTop: 16,
  },
  bodyText: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginBottom: 12,
    textAlign: "justify",
  },
  bulletPoint: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginBottom: 8,
    paddingLeft: 12,
  },
  bulletList: {
    marginBottom: 16,
  },
  italicText: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.bodyText,
    lineHeight: 1.7,
    marginTop: 16,
    marginBottom: 12,
  },
  companyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.bodyText,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.bodyText,
    marginBottom: 8,
    marginTop: 0,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.bodyText,
    marginBottom: 24,
  },
});

// Format date for cover page
const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Expand acronyms
const expandAcronym = (value: string): string => {
  if (value.includes("DIF") && !value.includes("Destroy in Field")) {
    return value.replace(/DIF/g, "Destroy in Field (DIF)");
  }
  if (value.includes("RTV") && !value.includes("Return to Vendor")) {
    return value.replace(/RTV/g, "Return to Vendor (RTV)");
  }
  if (value.includes("ZVR") && !value.includes("Zero Value Return")) {
    return value.replace(/ZVR/g, "Zero Value Return (ZVR)");
  }
  return value;
};

// Format value for display
const formatValue = (value: string | number | string[] | undefined): string => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }
  if (Array.isArray(value)) {
    const formatted = value.length > 0 ? value.join(", ") : "N/A";
    return expandAcronym(formatted);
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return expandAcronym(value);
};

// Convert Yes/No to narrative sentences
const convertYesNo = (value: string, program: string): string => {
  if (value === "Yes") {
    return `The brand currently operates a ${program} program.`;
  }
  if (value === "No") {
    return `The brand does not currently operate a ${program} program.`;
  }
  return "";
};

// Convert value priority to narrative
const convertValuePriority = (value: string): string => {
  if (!value || value === "N/A") return "";
  return `The brand identifies ${value} as a primary driver for the reverse logistics program.`;
};

// Convert opportunity feeling to narrative
const convertOpportunityFeeling = (value: string): string => {
  if (value === "Yes") {
    return "The brand feels it is currently taking advantage of return opportunities.";
  }
  if (value === "No") {
    return "The brand does not feel it is currently taking advantage of return opportunities.";
  }
  return "";
};

// Format numbers with commas
const formatNumbers = (value: string): string => {
  if (!value) return "";
  const num = value.replace(/,/g, "");
  const parsed = parseInt(num);
  if (isNaN(parsed)) return value;
  return parsed.toLocaleString();
};


// Header component (fixed on every page)
const PageHeader = () => (
  <View style={styles.header} fixed>
    <Text style={styles.logoText}>Nok Recommerce</Text>
  </View>
);

// Footer component (appears on every page with fixed prop)
const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.confidentialFooter}>Confidential</Text>
  </View>
);

// Page 1: Introduction & Executive Summary
const Page1Intro = ({ companyName, contactName }: { companyName: string; contactName: string }) => (
  <Page size="A4" style={styles.contentPage} break>
    <PageHeader />
    <PageFooter />
    <Text style={styles.mainTitle}>Request for Proposal</Text>
    <Text style={styles.subTitle}>Comprehensive Reverse Logistics Partner</Text>
    <Text style={styles.mainSectionTitle}>1.0 Introduction & Executive Summary</Text>
    
    <Text style={styles.subSectionTitle}>1.1 Company Overview</Text>
    <Text style={styles.companyName}>
      Company Name: {companyName || "N/A"}
    </Text>
    <Text style={styles.companyName}>
      Contact Name: {contactName || "N/A"}
    </Text>
    
    <Text style={styles.subSectionTitle}>1.2 Project Purpose</Text>
    <Text style={styles.bodyText}>
      This document was developed to establish a structured understanding of
      current operations, strategic priorities, and areas of opportunity. The
      information captured reflects a combination of operational inputs intended
      to surface efficiencies and highlight potential paths for improvement. The
      purpose of this assessment is to enable a collaborative discussion around
      priorities, constraints, and success metrics to ensure recommended
      initiatives are practical and positioned for long-term success.
    </Text>
  </Page>
);

// Page 2: Program Goals & Vision
const Page2Goals = ({ data }: { data: RfpFormValues }) => (
  <Page size="A4" style={styles.contentPage} break>
    <PageHeader />
    <PageFooter />
    <Text style={styles.mainSectionTitle}>2.0 Program Goals & Vision</Text>
    
    <Text style={styles.subSectionTitle}>2.1 Strategic Objectives</Text>
    {data.valuePriority && (
      <Text style={styles.bodyText}>
        {convertValuePriority(data.valuePriority)}
      </Text>
    )}
    {data.opportunityFeeling && (
      <Text style={styles.bodyText}>
        {convertOpportunityFeeling(data.opportunityFeeling)}
      </Text>
    )}
    {data.combineStrategy && data.combineStrategy !== "N/A" && (
      <Text style={styles.bodyText}>
        {data.combineStrategy === "Yes"
          ? "The brand is interested in combining excess inventory strategy with returns to create a broad recommerce strategy."
          : "The brand is not currently interested in combining excess inventory strategy with returns."}
      </Text>
    )}
  </Page>
);

// Page 3: Scope of Work
const Page3Scope = ({ data }: { data: RfpFormValues }) => (
  <Page size="A4" style={styles.contentPage} break>
    <PageHeader />
    <PageFooter />
    <Text style={styles.mainSectionTitle}>3.0 Scope of Work</Text>
    
    <Text style={styles.subSectionTitle}>3.1 Returns Management</Text>
    {data.returnsPerYear && (
      <Text style={styles.bodyText}>
        Annual return volume: {formatNumbers(data.returnsPerYear)} returns per
        year.
      </Text>
    )}
    {data.seasonality && (
      <Text style={styles.bodyText}>
        Seasonality pattern: {data.seasonality}.
      </Text>
    )}
    {data.currentReturnsHandling && data.currentReturnsHandling !== "N/A" && (
      <Text style={styles.bodyText}>
        For returns that are sent back, the current process:{" "}
        {data.currentReturnsHandling}
      </Text>
    )}
    {data.returnsHandling && data.returnsHandling !== "N/A" && (
      <Text style={styles.bodyText}>
        Returns handling process: {data.returnsHandling}
      </Text>
    )}
    
    <Text style={styles.subSectionTitle}>3.2 Retail & Recommerce Strategy</Text>
    {data.sellsIntoRetailers && (
      <Text style={styles.bodyText}>
        {data.sellsIntoRetailers === "Yes"
          ? "The brand sells into retailers."
          : "The brand does not sell into retailers."}
      </Text>
    )}
    {data.sellsIntoRetailers === "Yes" && data.retailerProgram && (
      <Text style={styles.bodyText}>
        Retailer program: {expandAcronym(data.retailerProgram)}.
      </Text>
    )}
    {data.interestedChannels && data.interestedChannels.length > 0 && (
      <Text style={styles.bodyText}>
        Interested recommerce channels:{" "}
        {expandAcronym(data.interestedChannels.join(", "))}.
      </Text>
    )}
    {data.channelRestrictions && data.channelRestrictions !== "N/A" && (
      <Text style={styles.bodyText}>
        Channel restrictions: {data.channelRestrictions}.
      </Text>
    )}
    {data.salesSplitDtc !== undefined && (
      <Text style={styles.bodyText}>
        Sales split: {data.salesSplitDtc}% DTC, {100 - data.salesSplitDtc}%
        retail.
      </Text>
    )}
  </Page>
);

// Page 4: Technology & Strategic Considerations
const Page4Tech = ({ data }: { data: RfpFormValues }) => (
  <Page size="A4" style={styles.contentPage} break>
    <PageHeader />
    <PageFooter />
    <Text style={styles.mainSectionTitle}>
      4.0 Technology & Strategic Considerations
    </Text>
    
    <Text style={styles.subSectionTitle}>4.1 Implementation Framework</Text>
    {data.excessInventoryChannel && (
      <Text style={styles.bodyText}>
        Excess inventory sales channel: {data.excessInventoryChannel}.
        {data.excessInventoryChannel === "Off-Priced Retailers (National)" &&
          data.excessInventoryNational &&
          ` National retailers: ${data.excessInventoryNational}.`}
        {data.excessInventoryChannel === "Off-Priced Retailers (Regional)" &&
          data.excessInventoryRegional &&
          ` Regional retailers: ${data.excessInventoryRegional}.`}
      </Text>
    )}
    {data.tradeIn && (
      <Text style={styles.bodyText}>
        {data.tradeIn === "Yes"
          ? "The brand is interested in a Trade-In program."
          : "The brand is not currently interested in a Trade-In program."}
      </Text>
    )}
    {data.brandedDtc && (
      <Text style={styles.bodyText}>
        {data.brandedDtc === "Yes"
          ? `The brand is interested in a branded second-hand DTC program.${
              data.brandedManagement
                ? ` Preferred management approach: ${data.brandedManagement}.`
                : ""
            }`
          : "The brand is not currently interested in a branded second-hand DTC program."}
      </Text>
    )}
    
    <Text style={styles.subSectionTitle}>4.2 Strategic Insights</Text>
    <Text style={styles.italicText}>
      Strategic Context: The intersection of annual return volumes and existing
      retail program structures establishes the baseline for required facility
      throughput.
    </Text>
    <Text style={styles.italicText}>
      Market Consideration: Defined channel restrictions require a multi-tiered
      framework that protects primary market pricing while maximizing inventory
      recovery.
    </Text>
  </Page>
);

// Page 5: Evaluation Criteria & Next Steps
const Page5Evaluation = () => (
  <Page size="A4" style={styles.contentPage} break>
    <PageHeader />
    <PageFooter />
    <Text style={styles.mainSectionTitle}>
      5.0 Evaluation Criteria & Next Steps
    </Text>
    
    <Text style={styles.subSectionTitle}>5.1 Evaluation Framework</Text>
    <View style={styles.bulletList}>
      <Text style={styles.bulletPoint}>
        • Strategic Alignment (30%)
      </Text>
      <Text style={styles.bulletPoint}>
        • Capability & Experience (30%)
      </Text>
      <Text style={styles.bulletPoint}>
        • Technology & Innovation (20%)
      </Text>
      <Text style={styles.bulletPoint}>
        • Pricing & Value (20%)
      </Text>
    </View>
    
    <Text style={styles.subSectionTitle}>5.2 Next Steps</Text>
    <Text style={styles.bodyText}>
      A Nok expert (Maddy) will reach out shortly to facilitate a review of
      these findings, validate the assumptions captured here, and explore
      alignment with broader business objectives. This process is intended to
      support scalable, data-informed decisions.
    </Text>
  </Page>
);

// Main PDF component
export function RfpPdf({ data }: { data: RfpFormValues }) {
  return (
    <Document>
      <Page1Intro companyName={data.companyName || ""} contactName={data.name || ""} />
      <Page2Goals data={data} />
      <Page3Scope data={data} />
      <Page4Tech data={data} />
      <Page5Evaluation />
    </Document>
  );
}
