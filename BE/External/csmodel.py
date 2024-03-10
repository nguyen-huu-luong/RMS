class CustomerSegmentModel:
  def __init__(self, model, scaler):
    self.model = model
    self.scaler = scaler

  def segmentCustomer(self, customers):
    customers = self.scaler.transform(customers)
    groups = self.model.predict(customers)
    return groups