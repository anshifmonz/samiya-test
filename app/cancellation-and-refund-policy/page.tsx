export default function CancellationAndRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-luxury-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <header className="text-center mb-12">
            <h1 className="luxury-heading text-4xl md:text-5xl text-luxury-black mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="luxury-body text-luxury-gray text-sm">
              <time dateTime="2025-08-08">Last updated on 08-08-2025 18:08:14</time>
            </p>
          </header>

          <section className="prose prose-lg max-w-none">
            <div className="luxury-body text-luxury-black leading-relaxed space-y-6">
              <p className="text-lg">
                <strong>SAMIYA SILKS</strong> believes in helping its customers as far as possible, and has therefore a liberal
                cancellation policy. Under this policy:
              </p>

              <h2 className="luxury-heading text-2xl text-luxury-black mt-8 mb-6">Policy Terms</h2>

              <ul className="space-y-6 list-none">
                <li className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-2 h-2 bg-luxury-gold rounded-full mt-3" aria-hidden="true"></span>
                  <p>
                    <strong>Order Cancellation:</strong> Cancellations will be considered only if the request is made immediately after placing the order.
                    However, the cancellation request may not be entertained if the orders have been communicated to the
                    vendors/merchants and they have initiated the process of shipping them.
                  </p>
                </li>

                <li className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-2 h-2 bg-luxury-gold rounded-full mt-3" aria-hidden="true"></span>
                  <p>
                    <strong>Perishable Items:</strong> SAMIYA SILKS does not accept cancellation requests for perishable items like flowers, eatables etc.
                    However, refund/replacement can be made if the customer establishes that the quality of product
                    delivered is not good.
                  </p>
                </li>

                <li className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-2 h-2 bg-luxury-gold rounded-full mt-3" aria-hidden="true"></span>
                  <p>
                    <strong>Damaged or Defective Items:</strong> In case of receipt of damaged or defective items please report the same to our Customer Service team.
                    The request will, however, be entertained once the merchant has checked and determined the same at his
                    own end. This should be reported within <strong>7 days</strong> of receipt of the products. In case you feel that the
                    product received is not as shown on the site or as per your expectations, you must bring it to the notice of
                    our customer service within <strong>7 days</strong> of receiving the product. The Customer Service Team after
                    looking into your complaint will take an appropriate decision.
                  </p>
                </li>

                <li className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-2 h-2 bg-luxury-gold rounded-full mt-3" aria-hidden="true"></span>
                  <p>
                    <strong>Warranty Claims and Refund Processing:</strong> In case of complaints regarding products that come with a warranty from manufacturers, please refer
                    the issue to them. In case of any Refunds approved by the SAMIYA SILKS, it&apos;ll take <strong>3-5 days</strong> for
                    the refund to be processed to the end customer.
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
