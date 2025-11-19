import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  showAgreeButton?: boolean;
}

const privacyPolicyContent = `Counseling Privacy & Confidentiality Policy

PURPOSE
This policy outlines how 'Unveiled Echo: Of The Inner Self' collects, uses, stores, and protects personal and sensitive personal data of clients receiving counseling and mental health services, in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 and relevant healthcare regulations in India. The policy also describes clients' rights and the Clinic's responsibilities for ensuring confidentiality in all counseling-related interactions.

SCOPE
This policy applies to:
• All counseling and mental health services provided by the Clinic.
• All Clinic staff, including counselors, psychologists, administrative personnel, trainees, and contracted service providers.
• All personal and sensitive personal data of clients, including digital and physical records.

DEFINITIONS
• Personal Data: Any data about an individual who is identifiable by or in relation to such data.
• Sensitive Personal Data (SPD): Includes health information, mental health conditions, sexual history, gender identity, medical records, and any additional categories recognized under Indian law.
• Data Principal: The individual to whom the personal data relates (the client).
• Data Fiduciary: The Clinic, as the entity determining the purpose and means of processing personal data.

COLLECTION OF PERSONAL DATA
The Clinic collects personal and sensitive personal data only for legitimate counseling and healthcare purposes, including:
• Personal identification details (name, age, gender, contact information).
• Medical and mental health history.
• Counseling session notes and assessments.
• Emergency contact information.
• Billing and payment information (if applicable).

Data is collected directly from the client or legally authorized representatives, with explicit and informed consent as required under the DPDP Act.

USE OF PERSONAL DATA
The Clinic uses personal data only for purposes such as:
• Diagnosis, treatment, counseling, and care planning.
• Coordination with other healthcare providers (only with client consent).
• Administrative tasks including scheduling, billing, and reporting as required by law.
• Quality assurance and supervision (with de-identification whenever possible).
Personal data will not be used for any purpose unrelated to care without consent.

CONSENT REQUIREMENTS (DPDP COMPLIANT)
• Consent must be free, informed, specific, unconditional, and unambiguous.
• Clients may withdraw consent at any time, except where required for medical or legal reasons.
• The Clinic will explain what data is collected, why, how it is used, retention period, and rights available under the DPDP Act.

CONFIDENTIALITY IN COUNSELING
All client interactions, session content, records, and identifying information remain strictly confidential.
Information may only be shared under the following circumstances:
1. With explicit written consent from the client.
2. To prevent serious and imminent harm to the client or others.
3. When required by Indian law, including court orders, criminal investigations, or mandatory reporting obligations.
4. For supervision or peer review, with identifying information minimized.

No counseling information will be shared with family members, employers, or third parties without consent.

DATA STORAGE, PROTECTION & RETENTION
Storage
• Digital records are stored in encrypted systems with secure access controls.
• Physical files are kept in locked cabinets accessible only to authorized personnel.

Protection Measures
• Role-based access to sensitive files.
• Password protection, firewalls, and regular cybersecurity audits.
• Staff confidentiality agreements and annual data protection training.

Retention & Deletion
• Records are retained for the period required by healthcare regulations (generally 3–7 years).
• Upon completion of the retention period, records are deleted or destroyed securely, as per DPDP standards for data minimization and storage limitation.

CLIENTS' RIGHTS UNDER THE DPDP ACT
Clients (Data Principals) have the right to:
• Access their personal data.
• Correct or update inaccurate data.
• Withdraw consent (with limitations for essential healthcare functions).
• Request erasure of data that is no longer necessary for the purpose collected.
• Know the purpose and categories of data being processed.
• Seek grievance redressal through the Clinic's Data Protection Officer (DPO).

DATA SHARING WITH THIRD PARTIES
Personal data will only be shared with:
• Referral healthcare professionals (with consent).
• Emergency services, when necessary.
• Legal authorities as mandated by law.
• Third-party service providers (IT, billing, storage) under strict confidentiality and data processing agreements.
The Clinic will not sell, trade, or disclose data for marketing or non-clinical purposes.

BREACH RESPONSE PROTOCOL
In case of a data breach:
1. Immediate mitigation to secure data.
2. Internal investigation and documentation.
3. Notification to affected clients as required.
4. Corrective measures to prevent recurrence.

STAFF RESPONSIBILITIES
• Maintain confidentiality at all times.
• Use data only for authorized clinical purposes.
• Follow secure documentation and communication practices.
• Report any suspected breach immediately to the DPO.

DATA PROTECTION OFFICER (DPO)
The Clinic will appoint a Data Protection Officer or Privacy Lead responsible for:
• Ensuring compliance with the DPDP Act.
• Managing client data requests and grievances.
• Overseeing data audits, training, and breach response.

POLICY REVIEW
This policy will be reviewed annually or whenever relevant laws change, to ensure alignment with current Indian regulations and best practices in mental health privacy.`;

const PrivacyPolicyDialog = ({
  isOpen,
  onClose,
  onAgree,
  showAgreeButton = true,
}: PrivacyPolicyDialogProps) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setScrolledToBottom(isAtBottom);
    }
  };

  useEffect(() => {
    setScrolledToBottom(false);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Privacy Policy & Confidentiality</DialogTitle>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pr-4"
        >
          <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {privacyPolicyContent}
          </div>
        </div>

        {showAgreeButton && (
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Decline
            </Button>
            <Button
              onClick={onAgree}
              disabled={!scrolledToBottom}
              className="shadow-[0_0_30px_rgba(79,209,197,0.3)]"
            >
              {scrolledToBottom ? "I Agree & Continue" : "Scroll to Bottom to Agree"}
            </Button>
          </DialogFooter>
        )}

        {!showAgreeButton && (
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
